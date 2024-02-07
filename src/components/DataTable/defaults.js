
const types = {
    icon: {
        width: '100px',
        align: 'center'
    },
    numeric: {
        align: 'end',
        width: '100px',
        noWrap: true
    },
    money: {
        align: 'end',
        width: '100px',
        noWrap: true
    },
    date: {
        align: 'end',
        width: '250px',
        noWrap: true
    },
};

export default function (column, attribute) {
    if (types[column.type]) {
        return types[column.type][attribute] ?? false;
    }
    return false;
}
