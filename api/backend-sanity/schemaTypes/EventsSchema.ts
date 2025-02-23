import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Online', value: 'online' },
          { title: 'In-Person', value: 'in person' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      hidden: ({ parent }) => parent?.eventType === 'online', // Hide location for online events
    }),
    defineField({
      name: 'eventDateTime',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reminderTime',
      title: 'Reminder Time (30 mins before event)',
      type: 'datetime',
      readOnly: true, // Prevent manual edits
      description: 'Automatically set 30 minutes before the event.',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Reference to the MongoDB user ID',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eventDateTime',
    },
  },
});
