import { FormCheckbox } from "@/components/form/checkbox"
import { FormDatePicker } from "@/components/form/date-picker"
import FormInput from "@/components/form/input"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { FormSelect } from "@/components/form/select"
import FormTextarea from "@/components/form/textarea"
import { Button } from "@/components/ui/button"
import SeeInView from "@/components/ui/see-in-view"
import { FILTER, PROJECTS_TASKS, TASKS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useSearch } from "@tanstack/react-router"
import { Mic, MicOff, Paperclip, Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
    statusId?: number
}

export default function CompleteTaskManager({ statusId }: Props) {
    const params = useParams({ from: "/_main/project/$id" })
    const search = useSearch({ from: "/_main/project/$id" })
    const { data: hrData, isLoading } = useGet<
        { first_name?: string; last_name: string; id: number }[]
    >(`${FILTER}user`)
    const { data: task } = useGet<QuoteCard>(`${TASKS}/${search?.task}`, {
        options: {
            enabled: !!search?.task,
        },
    })

    const form = useForm<QuoteCard>({
        defaultValues: {
            title: "",
            desc: "",
            priority: 1,
            deadline: "",
            users: [],
            files: [] as { file: File; type: string }[],
            voiceNote: [],
            subtasks: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "subtasks",
    })

    const [isRecording, setIsRecording] = useState(false)
    const [deletedItem, setDeletedItem] = useState<number[]>([])
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()
    const { closeModal } = useModal("task-modal")

    const { mutate: mutateCreate, isPending: isPendingCreate } = usePost(
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [`${PROJECTS_TASKS}/${params?.id}`],
                })
                toast.success("Muaffaqiyatli qo'shildi")
                closeModal()
                form.reset()
                setDeletedItem([])
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = usePatch(
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [`${PROJECTS_TASKS}/${params?.id}`],
                })
                toast.success("Muaffaqiyatli yangilandi")
                closeModal()
                form.reset()
                setDeletedItem([])
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )

    const onSubmit = async (data: QuoteCard) => {
        const formData = new FormData()
        const dirtyFields = form.formState.dirtyFields
        const currentFiles = form.watch("files")

        if (currentFiles?.length) {
            currentFiles.forEach(({ file }) => {
                const isNewFile = !task?.files?.some(
                    (item) =>
                        item.file?.name === file.name &&
                        item.file?.size === file.size &&
                        item.type === getFileType(file),
                )

                if (isNewFile) {
                    formData.append(getFileType(file), file)
                }
            })
        }

        const fetchPromises: Promise<void>[] = []
        const currentVoiceNotes = form.watch("voiceNote") || []

        const backendAudios =
            task?.files
                ?.filter((item) => item.type === "audio")
                ?.map((item) => item.file) || []

        currentVoiceNotes.forEach((url: string, index: number) => {
            const isNewAudio = !backendAudios.some((file: any) => {
                if (!file) return false

                return typeof file === "string" && file === url
            })

            if (isNewAudio) {
                const promise = fetch(url)
                    .then((res) => res.blob())
                    .then((blob) => {
                        formData.append("audio", blob, `voice-${index}.wav`)
                    })
                fetchPromises.push(promise)
            }
        })

        await Promise.all(fetchPromises)

        if (statusId) {
            formData.append("status", statusId.toString())
        }
        formData.append("subtasks", JSON.stringify(data.subtasks))
        formData.append("users", JSON.stringify(data.users))

        if (deletedItem?.length > 0) {
            formData.append("deleted_files", JSON.stringify(deletedItem))
        }

        for (const [key, value] of Object.entries(data)) {
            if (
                !["files", "subtasks", "voiceNote", "users"].includes(key) &&
                (dirtyFields as any)[key]
            ) {
                formData.append(key, String(value))
            }
        }

        const url = task?.id ? `${TASKS}/${task.id}` : TASKS
        const mutate = task?.id ? mutateUpdate : mutateCreate
        mutate(url, formData)
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder

            const audioChunks: BlobPart[] = []
            mediaRecorder.ondataavailable = (event) =>
                audioChunks.push(event.data)

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: "audio/wav" })
                const url = URL.createObjectURL(blob)
                const currentVoiceNotes = form.getValues("voiceNote")
                form.setValue("voiceNote", [...currentVoiceNotes, url])
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            setRecordingTime(0)

            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)
        } catch (error) {
            console.error("Mic error:", error)
        }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
        clearInterval(recordingIntervalRef.current!)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const currentFiles = form.getValues("files") || []

            const newFiles = Array.from(files).map((file) => ({
                file,
                type: getFileType(file),
            }))

            form.setValue("files", [...currentFiles, ...newFiles])
        }
    }

    useEffect(() => {
        if (task?.id) {
            form.reset({
                ...task,
                voiceNote: task.files
                    ?.filter((item) => item.type === "audio")
                    .map((item) => item.file),
                files: task.files
                    ?.filter((item) => item.type !== "audio")
                    .map((item) => item),
            })
        }
    }, [form, task, search])

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-[85vh] overflow-y-auto sm:space-y-6 space-y-4 px-2 pb-[64px] no-scrollbar-x"
        >
            {/* Title */}
            <FormInput
                required
                label={"Vazifa nomi"}
                methods={form}
                name={"title"}
                type="text"
            />

            {/* Description */}
            <FormTextarea
                required
                methods={form}
                name="desc"
                label="Tavsif"
                placeholder="Vazifa haqida"
            />

            {/* Priority & Deadline */}
            <div className="grid sm:grid-cols-2 gap-4 ">
                <FormSelect
                    label="Muhimlik darajasi"
                    control={form.control}
                    labelKey="label"
                    valueKey="key"
                    name="priority"
                    options={[
                        { label: "Past", key: 1 },
                        { label: "O'rta", key: 2 },
                        { label: "Yuqori", key: 3 },
                    ]}
                />
                <FormDatePicker
                    label="Muddati"
                    name="deadline"
                    control={form.control}
                />
            </div>

            {/* Assigned To */}
            <FormMultiCombobox
                label="Ma'sul hodim"
                control={form.control}
                name="users"
                labelKey="full_name"
                valueKey="id"
                options={hrData?.map((item) => ({
                    full_name: `${item.first_name} ${item.last_name}`,
                    id: item.id,
                }))}
                isLoading={isLoading}
            />

            {/* Subtasks */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label>Kichik vazifalar</label>
                    <Button
                        type="button"
                        className="min-w-8 w-[115px]"
                        onClick={() =>
                            append({
                                id: Date.now(),
                                title: "",
                                finished: false,
                            })
                        }
                    >
                        <Plus className="w-5 h-5" /> Qo'shish
                    </Button>
                </div>
                {fields?.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                    >
                        <FormCheckbox
                            control={form.control}
                            name={`subtasks.${index}.finished`}
                        />
                        <FormInput
                            methods={form}
                            name={`subtasks.${index}.title`}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            className="min-w-8"
                            onClick={() => remove(index)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Images */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label>Rasmlar</label>
                    <Button
                        className="w-[115px]"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-4 h-4 mr-1" /> Yuklash
                    </Button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <div className="grid grid-cols-3 gap-2">
                    {form
                        .watch("files")
                        ?.slice()
                        ?.sort((a, b) => (a.type === "image" ? -1 : 1))
                        ?.map((item, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "relative",
                                    item.type !== "image" && "col-span-3 flex items-center justify-between gap-3",
                                )}
                            >
                                {item.type === "image" ? (
                                    <SeeInView
                                        url={
                                            typeof item.file !== "string"
                                                ? URL.createObjectURL(item.file)
                                                : item.file
                                        }
                                        fullWidth
                                        className="w-full h-[200px] object-cover rounded-md border"
                                    />
                                ) : (
                                    <div className="w-full text-sm flex flex-col bg-secondary rounded-md px-3 py-[10px]">
                                        <span className="line-clamp-1 break-all">
                                            {typeof item.file === "string"
                                                ? item.file
                                                : item.file.name}
                                        </span>
                                    </div>
                                )}

                                <Button
                                    variant={"destructive"}
                                    type="button"
                                    className={cn(
                                        item.type === "image"
                                            ? " bg-red-500 hover:bg-red-500/90 absolute text-white w-7 h-7 p-0 top-0 right-0 min-w-8 "
                                            : "",
                                    )}
                                    onClick={() => {
                                        const currentFiles = form.watch("files")

                                        const deletedFile: any =
                                            currentFiles.find(
                                                (f) => f.file === item.file,
                                            )
                                        const fileId = deletedFile?.id
                                        const updatedFiles =
                                            currentFiles.filter(
                                                (f) => f.file !== item.file,
                                            )
                                        form.setValue("files", updatedFiles)

                                        if (fileId) {
                                            setDeletedItem((prev) => [
                                                ...prev,
                                                fileId,
                                            ])
                                        }
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                </div>
            </div>

            {/* Voice Notes */}
            <div>
                <div
                    className={cn(
                        "flex justify-between items-center  ",
                        form.watch("voiceNote")?.length && "mb-4",
                    )}
                >
                    <label>Ovozli xabarlar</label>
                    <Button
                        className={isRecording ? "w-max" : "w-[115px]"}
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        color={isRecording ? "danger" : "default"}
                    >
                        {isRecording ? (
                            <>
                                <MicOff className="w-4 h-4" /> To'xtatish (
                                {formatTime(recordingTime)})
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4 mr-1" /> Yozish
                            </>
                        )}
                    </Button>
                </div>
                {form.watch("voiceNote")?.map((note, i) => (
                    <div key={i} className="flex items-center gap-3 mb-2">
                        <audio controls src={note} className="flex-1 h-11 " />
                        <Button
                            type="button"
                            variant="destructive"
                            className="min-w-8"
                            onClick={() => {
                                const audioFiles =
                                    task?.files?.filter(
                                        (item) => item.type === "audio",
                                    ) || []

                                const fileId = audioFiles[i]?.id

                                if (fileId) {
                                    setDeletedItem((prev) => [...prev, fileId])
                                }

                                form.setValue(
                                    "voiceNote",
                                    form
                                        .watch("voiceNote")
                                        .filter((_, idx) => idx !== i),
                                )
                            }}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="flex absolute bottom-0 right-0 p-3 w-full bg-zinc-900 justify-end border-t border-t-zinc-700 ">
                <Button
                    disabled={isPendingCreate || isPendingUpdate}
                    loading={isPendingCreate || isPendingUpdate}
                    type="submit"
                    className="sm:w-[115px] w-full"
                >
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

const getFileType = (file: File): string => {
    const mimeType = file?.type
    if (mimeType?.startsWith("image/")) return "image"
    return "file"
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
}
