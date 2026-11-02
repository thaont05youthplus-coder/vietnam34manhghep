"use client";

import React from "react";
import { ToolId } from "@/types/workspace";
import { ProvinceFeature } from "@/types/geo";
import { ChatBoxModal } from "@/components/chatbox/ChatBoxModal";
import { QuestionBankModal, GeoQuestion } from "@/components/question-bank/QuestionBankModal";
import { DualNotesModal } from "@/components/notes/DualNotesModal";
import { StudyQuizletModal } from "@/components/study/StudyQuizletModal";

interface ToolContentProps {
  toolId: ToolId;
  selectedProvince: ProvinceFeature | null;
  onOpenNotesWithText?: (text: string) => void;
  onLocateProvince?: (provinceCode: string) => void;
  onAddToStudy?: (question: GeoQuestion) => void;
  sharedNoteText?: string;
}

export const ToolContent: React.FC<ToolContentProps> = ({
  toolId,
  selectedProvince,
  onOpenNotesWithText,
  onLocateProvince,
  onAddToStudy,
  sharedNoteText,
}) => {
  switch (toolId) {
    case "chat":
      return (
        <ChatBoxModal
          selectedProvince={selectedProvince}
          onOpenNotes={onOpenNotesWithText}
        />
      );
    case "questions":
      return (
        <QuestionBankModal
          selectedProvince={selectedProvince}
          onLocateProvince={onLocateProvince}
          onAddToStudy={onAddToStudy}
        />
      );
    case "notes":
      return (
        <DualNotesModal
          selectedProvince={selectedProvince}
          initialNoteText={sharedNoteText}
        />
      );
    case "study":
      return (
        <StudyQuizletModal
          selectedProvince={selectedProvince}
          onLocateProvince={onLocateProvince}
        />
      );
    default:
      return null;
  }
};
