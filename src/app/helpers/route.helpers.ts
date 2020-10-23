export function stringToRoute(string: string): string {
    return string.replace(/\W/g, '');
}
