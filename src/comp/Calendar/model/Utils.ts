
export function formatDateString(date : Date) : string{
    return date.getFullYear() +'-'+ String(date.getMonth()+1).padStart(2,'0') +'-'+ String(date.getDate()).padStart(2,'0');
}

export function compareTime(a : string,b:string){
    const _a = parseInt(a.replace(":",''));
    const _b = parseInt(b.replace(":",''));
    
    return _a-_b;
}