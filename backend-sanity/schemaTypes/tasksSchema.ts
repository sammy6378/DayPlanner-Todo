import { defineField, defineType } from "sanity";


export default defineType({
  name: 'task',
  title: 'Task',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'ToDo', value: 'todo' },
          { title: 'In Progress', value: 'inprogress' },
          { title: 'Done', value: 'done' },
        ],
        layout: 'radio', // Displays as radio buttons
      },
      initialValue: 'todo',
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'datetime',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Reference to the MongoDB user ID',
    }),
  ],
});
