import TopBar from './TopBar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <TopBar />
      <div style={{display:'flex',flex:1}}>
        <Sidebar />
        <main style={{flex:1,padding:24}}>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
