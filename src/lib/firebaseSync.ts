import { db, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from './firebase';
import { NodeProtocolActivity, CampaignEvent } from '../types';

export function subscribeToNodeActivities(
  onData: (activities: NodeProtocolActivity[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, 'node_activities');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onData([]);
          return;
        }
        const items: NodeProtocolActivity[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NodeProtocolActivity, 'id'>),
        }));
        onData(items);
      },
      (err) => {
        console.warn('Firestore node_activities listener error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Firestore initialization error:', err);
    if (onError) onError(err);
    return () => {};
  }
}

export async function saveNodeActivityToFirebase(activity: NodeProtocolActivity) {
  try {
    const docRef = doc(db, 'node_activities', activity.id);
    await setDoc(docRef, activity);
  } catch (err) {
    console.warn('Failed to save node activity to Firebase:', err);
  }
}

export async function deleteNodeActivityFromFirebase(id: string) {
  try {
    const docRef = doc(db, 'node_activities', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete node activity from Firebase:', err);
  }
}

export function subscribeToCampaignEvents(
  onData: (campaigns: CampaignEvent[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, 'campaign_events');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onData([]);
          return;
        }
        const items: CampaignEvent[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CampaignEvent, 'id'>),
        }));
        onData(items);
      },
      (err) => {
        console.warn('Firestore campaign_events listener error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Firestore initialization error:', err);
    if (onError) onError(err);
    return () => {};
  }
}

export async function saveCampaignToFirebase(campaign: CampaignEvent) {
  try {
    const docRef = doc(db, 'campaign_events', campaign.id);
    await setDoc(docRef, campaign);
  } catch (err) {
    console.warn('Failed to save campaign to Firebase:', err);
  }
}
