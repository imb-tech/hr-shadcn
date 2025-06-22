import { FormCheckbox } from "@/components/form/checkbox"
import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import FormInput from "@/components/form/input"
import { FormSelect } from "@/components/form/select"
import FormTextarea from "@/components/form/textarea"
import { Button } from "@/components/ui/button"
import SeeInView from "@/components/ui/see-in-view"
import { HR_API } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { ImageIcon, Mic, MicOff, Plus, Save, X } from "lucide-react"
import { useRef, useState } from "react"
import {  useFieldArray, useForm } from "react-hook-form"

interface SubTask {
    id: number
    title: string
    completed: boolean
}

interface TaskFormInputs {
    title: string
    description: string
    priority: 1 | 2 | 3
    deadline: string
    assignedTo: number | null
    images: string[]
    voiceNotes: string[]
    subtasks: SubTask[]
}

export default function CompleteTaskManager() {
    const [search, setSearch] = useState("")
    const { data: hrData, isLoading } = useGet<ListResponse<Human>>(HR_API, {
        params: { search, page_size: 50 },
    })
    const form = useForm<TaskFormInputs>({
        defaultValues: {
            title: "",
            description: "",
            priority: 2,
            deadline: "",
            assignedTo: null,
            images: [],
            voiceNotes: [],
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

    const onSubmit = (data: TaskFormInputs) => {
        console.log("Task created:", data)
        // form.reset();
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
                const currentVoiceNotes = form.getValues("voiceNotes")
                form.setValue("voiceNotes", [...currentVoiceNotes, url])
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

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-h-[85vh] overflow-y-auto space-y-6 px-2 pb-20 no-scrollbar-x"
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
                name="description"
                label="Tavsif"
                placeholder="Vazifa haqida"
            />

            {/* Priority & Deadline */}
            <div className="grid grid-cols-2 gap-4 ">
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
            <div className="pt-[0.1px]">
                <FormCombobox
                    label="Ma'sul hodim"
                    control={form.control}
                    name="assignedTo"
                    labelKey="full_name"
                    valueKey="id"
                    options={hrData?.results}
                    isLoading={isLoading}
                    onSearchChange={(val) => setSearch(val)}
                />
            </div>

            {/* Subtasks */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label>Kichik vazifalar</label>
                    <Button
                        type="button"
                        className="min-w-8"
                        onClick={() =>
                            append({
                                id: Date.now(),
                                title: "",
                                completed: false,
                            })
                        }
                    >
                        <Plus className="w-4 h-4" /> Qo'shish
                    </Button>
                </div>
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div>
                            <label className="opacity-0" htmlFor="chexbox">
                                Ch
                            </label>
                            <FormCheckbox
                                control={form.control}
                                name={`subtasks.${index}.completed`}
                            />
                        </div>
                        <FormInput
                            methods={form}
                            name={`subtasks.${index}.title`}
                            label="Kichik vazifa nomi"
                            className="flex-1"
                        />
                        <div>
                            <label className="opacity-0" htmlFor="chexbox">
                                Ch
                            </label>
                            <Button
                                type="button"
                                variant="destructive"
                                className="min-w-8"
                                onClick={() => remove(index)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Images */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label>Rasmlar</label>
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="w-4 h-4" /> Yuklash
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
                    {form.watch("images").map((img, i) => (
                        <div key={i} className="relative">
                            <SeeInView
                                url={img}
                                fullWidth
                                className="w-full object-cover rounded-md border"
                            />

                            <Button
                                variant={"destructive"}
                                type="button"
                                className="absolute bg-red-500 text-white w-7 h-7 p-0 top-0 right-0 min-w-8 "
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
                <div className="flex justify-between items-center mb-4">
                    <label>Ovozli xabarlar</label>
                    <Button
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
                                <Mic className="w-4 h-4" /> Yozish
                            </>
                        )}
                    </Button>
                </div>
                {form.watch("voiceNotes").map((note, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <audio controls src={note} className="flex-1 h-11 " />
                        <Button
                            type="button"
                            variant="destructive"
                            className="min-w-8"
                            onClick={() =>
                                form.setValue(
                                    "voiceNotes",
                                    form
                                        .watch("voiceNotes")
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
                <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Yaratish
                </Button>
            </div>
        </form>
    )
}
