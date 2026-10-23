
import { useEffect, useRef, useState } from "react";

import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../services/messagesService";

export function useAdminMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mounted = useRef(false);
  const busy = useRef(false);
  const controllerRef = useRef(null);

  async function refresh() {
    if (busy.current) return;

    busy.current = true;

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setNotice(null);

    try {
      const items = await getMessages({
        signal: controller.signal,
      });

      if (mounted.current && !controller.signal.aborted) {
        setMessages(items);
      }
    } catch (err) {
      if (mounted.current && !controller.signal.aborted) {
        setError(
          err instanceof Error
            ? err.message
            : "Хабарламаларды жүктеу мүмкін болмады."
        );
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        busy.current = false;

        if (mounted.current) {
          setLoading(false);
        }
      }
    }
  }

  useEffect(() => {
    mounted.current = true;
    refresh();

    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
      controllerRef.current = null;
      busy.current = false;
    };
  }, []);

  async function changeStatus(id, nextStatus) {
    if (busy.current || error) return;

    busy.current = true;
    setSaving(true);
    setNotice(null);

    try {
      const updated = await updateMessageStatus(id, nextStatus);

      if (!mounted.current) return;

      setMessages((current) =>
        current.map((item) =>
          String(item.id) === String(updated.id)
            ? updated
            : item
        )
      );

      setNotice({
        error: false,
        text: "Хабарлама күйі сақталды.",
      });
    } catch (err) {
      if (!mounted.current) return;

      setNotice({
        error: true,
        text:
          err instanceof Error
            ? err.message
            : "Хабарлама күйін сақтау мүмкін болмады.",
      });
    } finally {
      busy.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  async function removeMessage(id) {
    if (busy.current || error) return;

    const confirmed = window.confirm(
      "Бұл хабарламаны біржола жойғыңыз келе ме? Бұл әрекетті қайтару мүмкін емес."
    );

    if (!confirmed) return;

    busy.current = true;
    setSaving(true);
    setNotice(null);

    try {
      await deleteMessage(id);

      if (!mounted.current) return;

      setMessages((current) =>
        current.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      setNotice({
        error: false,
        text: "Хабарлама сәтті жойылды.",
      });
    } catch (err) {
      if (!mounted.current) return;

      setNotice({
        error: true,
        text:
          err instanceof Error
            ? err.message
            : "Хабарламаны жою мүмкін болмады.",
      });
    } finally {
      busy.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  return {
    messages,
    error,
    notice,
    loading,
    saving,
    newCount: messages.filter(
      (item) => item.status === "new"
    ).length,
    refresh,
    changeStatus,
    removeMessage,
  };
}
