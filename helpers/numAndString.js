const checkForNumAndString = (str) => {
    let isNum = false;
    let isString = false;

    str.split(' ').map((v) => {
        if (Number(v)) {
            return (isNum = true);
        }

        if (typeof v === 'string') {
            return (isString = true);
        }
    });

    return isNum === isString;
};

export default checkForNumAndString;
