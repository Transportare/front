export const separadorMiles = (value, descimal: number = 2) => {
    if (value === '' || value === null || value === undefined) {
        return '';
    }
    const entrada = value.toString().split('.');
    const parteEntera = entrada[0].replace(/\./g, '');
    const parteDecimal = entrada[1];
    const salida = parteEntera.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if (parteEntera === '' || parteEntera === null || parteEntera === undefined) {
        return '';
    } else {
        let decimales = '';
        if (descimal > 0) {
            if (parteDecimal !== undefined) {
                decimales = '.' + parteDecimal.substring(0, descimal);
                const total = descimal - (decimales.length - 1);
                if (total > 0) {
                    for (let index = 0; index < total; index++) {
                        decimales += '0';
                    }
                }
            } else {
                decimales = '.';
                for (let index = 0; index < descimal; index++) {
                    decimales += '0';
                }
            }
        }
        return salida + decimales;
    }
};
