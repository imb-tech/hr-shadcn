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

export default function CompleteTaskManager() {
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
            images: [],
            voiceNote: [],
            subtasks: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "subtasks",
    })

    const [isRecording, setIsRecording] = useState(false)
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
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )

    const onSubmit = (data: QuoteCard) => {
        console.log("Task created:", data)
        if (task?.id) {
            mutateUpdate(`${TASKS}/${task.id}`, data)
        } else {
            mutateCreate(TASKS, data)
        }
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const readers = Array.from(files).map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (e) => resolve(e.target?.result as string)
                    reader.readAsDataURL(file)
                })
            })

            Promise.all(readers).then((images) => {
                const currentImages = form.getValues("images")
                form.setValue("images", [...currentImages, ...images])
            })
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    useEffect(() => {
        if (task?.id) {
            form.reset(task)
        }
    }, [form, task, search])

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-h-[85vh] overflow-y-auto sm:space-y-6 space-y-4 px-2 pb-[64px] no-scrollbar-x"
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
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <div className="grid grid-cols-3 gap-2">
                    {form.watch("images")?.map((img, i) => (
                        <div key={i} className="relative">
                            <SeeInView
                                url={img}
                                fullWidth
                                className="w-full object-cover rounded-md border"
                            />

                            <Button
                                variant={"destructive"}
                                type="button"
                                className="absolute bg-red-500 hover:bg-red-500/90 text-white w-7 h-7 p-0 top-0 right-0 min-w-8 "
                                onClick={() =>
                                    form.setValue(
                                        "images",
                                        form
                                            .watch("images")
                                            .filter((_, idx) => idx !== i),
                                    )
                                }
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
                        "flex justify-between items-center ",
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
                    <div key={i} className="flex items-center gap-3">
                        <audio controls src={note} className="flex-1 h-11 " />
                        <Button
                            type="button"
                            variant="destructive"
                            className="min-w-8"
                            onClick={() =>
                                form.setValue(
                                    "voiceNote",
                                    form
                                        .watch("voiceNote")
                                        .filter((_, idx) => idx !== i),
                                )
                            }
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
