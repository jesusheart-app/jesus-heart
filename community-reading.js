import { getAuth } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

// 기존 앱과 분리된 공동체 성경읽기 모듈입니다. 기존 기능을 변경하지 않습니다.
export function createCommunityReading({ app, readingId = 'today' }) {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const key = new Date().toISOString().slice(0,10);

  async function check() {
    const u = auth.currentUser;
    if (!u) throw new Error('로그인이 필요합니다.');
    await setDoc(doc(db, 'communityReading', key, 'readers', u.uid), {
      uid: u.uid,
      readingId,
      checked: true,
      checkedAt: new Date()
    });
  }

  async function myCheck() {
    const u = auth.currentUser;
    if (!u) return false;
    const s = await getDoc(doc(db, 'communityReading', key, 'readers', u.uid));
    return s.exists() && s.data().checked === true;
  }

  async function count() {
    const s = await getDocs(collection(db, 'communityReading', key, 'readers'));
    return s.size;
  }

  return { check, myCheck, count };
}
