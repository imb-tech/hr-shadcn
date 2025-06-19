export default function getPlan(usersCount = 0) {
    if (usersCount < 21) {
        return `${usersCount} / 20`
    } else if (usersCount < 51) {
        return `${usersCount} / 50`
    } else if (usersCount < 101) {
        return `${usersCount} / 100`
    } else {
        return `${usersCount} / 100+`
    }
}