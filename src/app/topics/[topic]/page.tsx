// src/app/topics/[topic]/page.tsx
import { redirect } from "next/navigation";

export default async function TopicRedirectPage(props: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await props.params;
  redirect(`/topics/writing/${topic}`);
}
