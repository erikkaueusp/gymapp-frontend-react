export const formatarDataBR = (dataIso: string): string => {
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
};
