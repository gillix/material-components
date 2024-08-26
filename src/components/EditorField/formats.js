import {
    mdiCodeBlockBraces,
    mdiCodeBraces,
    mdiFormatBold, mdiFormatClear,
    mdiFormatHeader1,
    mdiFormatHeader2,
    mdiFormatHeader3, mdiFormatHeader4, mdiFormatHeader5, mdiFormatHeader6,
    mdiFormatIndentDecrease,
    mdiFormatIndentIncrease, mdiFormatItalic,
    mdiFormatListBulleted,
    mdiFormatListChecks,
    mdiFormatListNumbered,
    mdiImage,
    mdiLink, mdiMinus
} from "@mdi/js";

export const toolbar = {
    mini: ['bold', 'italic', 'header4', 'header5', 'header6', 'bulletList', 'orderedList']
};

export const formats = {
    bold: {
//        caption: '<b>B</b>'
        icon: mdiFormatBold
    },
    italic: {
//        caption: '<em>I</em>'
        icon: mdiFormatItalic
    },
    bulletList: {
        icon: mdiFormatListBulleted,
        iconSize: '23px',
        active: active => active.list === 'bullet',
    },
    orderedList: {
        icon: mdiFormatListNumbered,
        iconSize: '23px',
        active: active => active.list === 'ordered',
    },
    checkList: {
        icon: mdiFormatListChecks,
        iconSize: '23px',
        active: active => active.list === 'check',
    },
    link: {
        icon: mdiLink
    },
    image: {
        icon: mdiImage
    },
    code: {
        icon: mdiCodeBraces
    },
    'code-block': {
        icon: mdiCodeBlockBraces
    },
    indent: {
        icon: mdiFormatIndentIncrease
    },
    outdent: {
        icon: mdiFormatIndentDecrease
    },
    header1: {
        icon: mdiFormatHeader1,
        active: active => active.header === 1
    },
    header2: {
        icon: mdiFormatHeader2,
        active: active => active.header === 2
    },
    header3: {
        icon: mdiFormatHeader3,
        active: active => active.header === 3
    },
    header4: {
        icon: mdiFormatHeader4,
        active: active => active.header === 4
    },
    header5: {
        icon: mdiFormatHeader5,
        active: active => active.header === 5
    },
    header6: {
        icon: mdiFormatHeader6,
        active: active => active.header === 6
    },
    hr: {
        icon: mdiMinus,
    },
    clear: {
        icon: mdiFormatClear,
        command: (commands, editor) => {editor.removeFormat()}
    },
};
