
const Percent = (cur: number, total: number) => {
    console.log('percent:' + cur + '/' + total)
    if (cur > total) {
        cur = total
    }
    return '' + cur + '/' + total + ' [' + Math.floor(100 * cur/total) + '%]'
}

export { Percent }