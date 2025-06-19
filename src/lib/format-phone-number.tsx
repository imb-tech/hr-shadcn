export const formatPhoneNumber = (phoneNumberString: string | null) => {
    if (phoneNumberString) {
        return `${phoneNumberString.slice(0, 4)} ${phoneNumberString.slice(4, 6)} ${phoneNumberString.slice(6, 9)} ${phoneNumberString.slice(9, 11)} ${phoneNumberString.slice(11)}`
    } else {
        return ""
    }
}
