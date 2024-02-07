import { getRoot, types as t } from "mobx-state-tree";
// import TopicStore from "../Topics/TopicStore";
// import { destroyMessageStores } from "../../utils/models/ChatMessageUtils";
// import { getChatCurrentUserId } from "../../utils/ChatUtils";
// import { getConversationTotalNotifications } from "../../utils/models/ChatNotificationUtils";

const Model = {
    uid: t.optional(t.identifier, ""),
    name: t.maybe(t.string),
    conversationType: t.maybe(t.string),
    conversationUserIds: t.optional(t.array(t.string), []),
    icon: t.maybe(t.string),
    color: t.maybe(t.string),
    // topicStore: t.maybe(TopicStore),
    createdBy: t.maybe(t.string),
    pinnedUserIds: t.array(t.string),
    conversationSeenMessagesMap: t.frozen({}),
    createdTimestamp: t.optional(t.number, Date.now()),
    updatedTimestamp: t.optional(t.number, Date.now())
};

const Views = self => ({
    get conversationHasUnreadNotifications() {
        // return !!getConversationTotalNotifications(getRoot(self), self);
    },
    get isConversationPinned() {
        // return self.pinnedUserIds.includes(getChatCurrentUserId());
    },
    get isConversation() {
        return self.conversationType === "conversation";
    },
    get isPersonalConversation() {
        return self.conversationType === "personal";
    }
});

const Actions = self => ({
    beforeDestroy() {
        // destroyMessageStores(self);
    },
    open() {
        getRoot(self).conversationStore.setConversation(self.uid);
    },
    delete() {
        getRoot(self).conversationStore.deleteConversation(self.uid);
    },
    updateItemData(data) {
        Object.entries(data).map(([key, value]) => {
            self[key] = value;
        });
    }
});

const CollectionModel = t
    .model("ConversationModel", Model)
    .views(Views)
    .actions(Actions);

export default CollectionModel;
