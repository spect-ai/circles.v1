import { CardsType } from "@/app/types";

export function groupByAssignee(assigneeId: string, cards: CardsType) {
  const res = Object.values(cards)?.filter((card) => {
    if (card === undefined) return false;
    let assigneeFilt = false;
    const { assignee } = card;

    if (assignee.length == 0 && assigneeId.length == 0) return card;

    for (let i = 0; i < assignee.length; i += 1) {
      if (assigneeId == assignee[i]) {
        assigneeFilt = true;
        break;
      }
    }

    if (assigneeFilt == true) {
      return card;
    } else {
      return null;
    }
  });

  return res;
}