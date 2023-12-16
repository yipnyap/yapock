export function NamedTuple(fields: (string | number)[]) {
    return function(arr: string | any[]) {
        let obj = { };

        for(let i = 0; i < arr.length; i++) {
            // @ts-ignore
            obj[fields[i]] = arr[i];
        }

        return obj;
    };
}
