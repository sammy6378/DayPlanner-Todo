import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'reminder',
    title: 'Reminder',
    type: 'document',
    fields: [
        defineField({
            name: 'eventId',
            title: 'Event ID',
            type: 'reference',
            to: [{ type: 'event' }],
            description: 'Reference to the event',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'userId',
            title: 'User ID',
            type: 'string',
            description: 'Reference to the MongoDB user ID',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'reminderTime',
            title: 'Reminder Time',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sent',
            title: 'Sent Status',
            type: 'boolean',
            initialValue: false,
        }),
    ],
});
