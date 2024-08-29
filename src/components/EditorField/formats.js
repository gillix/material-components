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
    mini: ['bold', 'italic', 'header-smaller', 'header-small', 'bulletList', 'orderedList']
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
        iconSize: '24px',
        active: active => active.header === 4
    },
    header5: {
        icon: mdiFormatHeader5,
        iconSize: '20px',
        active: active => active.header === 5
    },
    header6: {
        icon: mdiFormatHeader6,
        iconSize: '16px',
        active: active => active.header === 6
    },
    'header-smaller': {
        command: 'header5',
        caption: '<span style="font-size: 18px">H</span>',
        active: active => active.header === 5
    },
    'header-small': {
        command: 'header6',
        caption: '<span style="font-size: 18px; text-transform: none; font-weight: 600">h</span>',
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
