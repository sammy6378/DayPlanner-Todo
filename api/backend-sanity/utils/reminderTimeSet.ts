import React from "react";
import { FormField } from "@sanity/ui";
import { useFormValue } from "sanity";

const ReminderTimeInput = (props) => {
  // Get the event reference
  const eventRef = useFormValue(["eventId"]);

  // Get event's datetime if available
  const eventDateTime = useFormValue(["eventId", "_ref"]) as string;

  let reminderTime = "";
  if (eventDateTime) {
    const eventTime = new Date(eventDateTime);
    reminderTime = new Date(eventTime.getTime() - 15 * 60000).toISOString(); // 15 minutes before
  }

  return (
    <FormField
      label="Reminder Time"
      description="Automatically set to 15 minutes before the event"
    >
      <input
        type="datetime-local"
        value={reminderTime}
        readOnly
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "100%",
        }}
      />
    </FormField>
  );
};

export default ReminderTimeInput;
