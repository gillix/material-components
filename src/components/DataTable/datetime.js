export const format = {
    date: (date, locale, fmt) => format.datetime(date, locale, {
        dateStyle: fmt ?? 'long',
    }),
    time: (date, locale, fmt) => format.datetime(date, locale, {
        timeStyle: fmt ?? 'short',
    }),
    datetime: (date, locale, options) =>
        new Intl.DateTimeFormat(locale, options ?? {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format((date instanceof Date ? date : new Date(date))),
};
