export const formatPhoneNumber = (phoneNumberString: string | null) =>{
    const phoneStr = String(phoneNumberString);

    const cleanedPhone = phoneStr.replace(/\D/g, '');

    const formattedPhone = `+998 ${cleanedPhone.slice(3, 5)} ${cleanedPhone.slice(5, 8)} ${cleanedPhone.slice(8, 10)} ${cleanedPhone.slice(10, 12)}`;

    return formattedPhone;
}

