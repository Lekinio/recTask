export function transformArray(array: []) {
    return array.map(item => !isNaN(item) ? Number(item) : String(item));
}