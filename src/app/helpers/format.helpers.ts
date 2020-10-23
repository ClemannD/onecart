const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
export function formatMoney(amount: number): string {
    return dollarFormatter
        .format(amount)
        .replace('.00', '')
        .replace('.50', '.5');
}
