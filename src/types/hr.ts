

type HumanProfile = {
  phone_number: string | number;
  phone_number2: string;
  id_number: string;
  address: string;
  residence: string;
  education: string | number;
}
type Human = {
  profile: HumanProfile
  phone: string | number;
  attendance_json?: {
    attendance_time?: string
    left_time?: string
  }
  phone_number: string | number;
  phone_number2: string;
  id_number: string;
  attendance_status?: number
  address: string;
  residence: string;
  education: string | number;
  id: number;
  middle_name: string;
  role: string | number;
  salary: number | string | undefined;
  password?: string
  first_name?: string
  last_name?: string
  image?: string
  full_name?: string
  username?: string
  companies?: any
  role_name?: string
  work_shift_start: string,
  work_shift_end: string,
  has_attendance?: boolean
  work_days: number[],
  excuses_status?: string | number
  status?: boolean
  fine_per_minute: number
  face?: string
  fine?: number
  hikvision_id?: number
  actions?: string[]
};

type HumanInMap = {}

type HumanYear = {
  year: number;
  late_count: number;
  early_checkout: string
  fine: string;
  date?:string;
  late_duraction: string
  month: string
  late_duration: string
  user: number
  salary: number
  left_time: string
  attendance_time: string
  work_shift_start: string
  work_shift_end: string
  status: string
  id: number
}

type Filter = {
  id: number
  name: string
  first_name: string
  last_name: string
}