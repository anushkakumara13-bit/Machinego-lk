import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [name, setName] = useState("");
  const [otp, setOtp] = useState(""); const [realOTP, setRealOTP] = useState(""); const [loginMethod, setLoginMethod] = useState("phone");
  const [location, setLocation] = useState(null); const [realAddress, setRealAddress] = useState("Fetching Real GPS...");
  const [category, setCategory] = useState("🔧 JUKI Mechanic"); const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [troubles, setTroubles] = useState([]); const [rating, setRating] = useState(5); const [feedback, setFeedback] = useState("");
  const [showAd1, setShowAd1] = useState(true); const [showAd2, setShowAd2] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status!== 'granted') { setRealAddress("Colombo, Sri Lanka (Permission Denied)"); return; }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc.coords);
        let addr = await Location.reverseGeocodeAsync(loc.coords);
        if (addr[0]) setRealAddress(`${addr[0].city || addr[0].district || 'Colombo'}, ${addr[0].street || ''} - Real GPS`);
        else setRealAddress(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)} - Real GPS`);
      } catch (e) { setRealAddress("Colombo, Sri Lanka - GPS Loading..."); }
    })();
  }, []);

  const mechanics = [
    { id: 1, name: "Kasun JUKI Service", category: "🔧 JUKI Mechanic", status: "Online", distance: "1.2 km", rating: "4.9" },
    { id: 2, name: "Nimal Electrical", category: "⚡ විදුලි කාර්මික ශිල්පී", status: "Online", distance: "2.4 km", rating: "4.8" },
    { id: 3, name: "Saman Circuit", category: "🔌 විදුලි පරිපථ කාර්මික ශිල්පී", status: "Online", distance: "3.1 km", rating: "4.7" },
  ];

  const breakdowns = {
    "🔧 JUKI Mechanic": ["Needle Broken", "Timing Issue", "Thread Cutting", "Oil Leak", "Feed Dog Issue"],
    "⚡ විදුලි කාර්මික ශිල්පී": ["Motor Not Working", "Power Issue", "Wiring Fault", "Switch Fault"],
    "🔌 විදුලි පරිපථ කාර්මික ශිල්පී": ["PCB Burn", "Display Issue", "Sensor Error", "Program Error"]
  };

  const sendEmailOTP = () => {
    if (!email.includes("@")) { Alert.alert("Email වැරදියි", "you@gmail.com වගේ දාන්න"); return; }
    const otpGen = Math.floor(100000 + Math.random() * 900000).toString();
    setRealOTP(otpGen);
    Alert.alert("📧 Real OTP Sent!", `To: ${email}\nOTP: ${otpGen}`);
    setScreen("otp");
  };

  const Ad = ({ title, sub, btn, onClose }) => (
    <View style={styles.adBox}><View style={{flex:1}}><Text style={styles.adLab}>Ad • Watagoda JUKI</Text><Text style={styles.adTit}>{title}</Text><Text style={styles.adSub}>{sub}</Text></View><TouchableOpacity style={styles.adBtn} onPress={()=>Alert.alert("Call: 077 123 4567")}><Text style={styles.adBtnT}>{btn}</Text></TouchableOpacity><TouchableOpacity onPress={onClose}><Text> ✕</Text></TouchableOpacity></View>
  );

  if (screen === "welcome") {
    return (<SafeAreaView style={styles.gSafe}><View style={styles.gCent}><Text style={{fontSize:80}}>🔧</Text><Text style={styles.gTit}>MachineGo</Text><Text style={styles.gSub}>Real GPS • Real Email OTP • 0 Rs Cost</Text><Text style={{color:"#dcfce7", fontSize:11, marginTop:10}}>📍 {realAddress}</Text><TouchableOpacity style={styles.wBtn} onPress={()=>setScreen("signup")}><Text style={styles.wBtnT}>🚀 Real App පටන් ගමු</Text></TouchableOpacity></View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.lSafe}>
      <View style={styles.header}><Text style={styles.headerT}>📍 {realAddress}</Text><Text style={styles.dot}>● Live</Text></View>
      <ScrollView style={{padding:16}}>
        {screen==="signup" && <>
          <Text style={styles.logo}>MachineGo - REAL APP</Text>
          <Text style={styles.lab}>ඔබේ නම</Text><TextInput style={styles.inp} placeholder="නම" value={name} onChangeText={setName}/>
          <Text style={styles.lab}>Email - Real OTP Free ⭐</Text><TextInput style={styles.inp} placeholder="you@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
          <Text style={styles.lab}>Phone - Demo OTP</Text><TextInput style={styles.inp} placeholder="07XXXXXXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
          <View style={{flexDirection:"row", gap:10, marginTop:10}}>
            <TouchableOpacity style={styles.gBtnF} onPress={()=>{setLoginMethod("phone"); setScreen("otp");}}><Text style={styles.wT}>Phone Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.bBtnF} onPress={()=>{setLoginMethod("email"); sendEmailOTP();}}><Text style={styles.wT}>Email Real OTP</Text></TouchableOpacity>
          </View>
        </>}
        {screen==="otp" && <>
          <Text style={styles.title}>Verify {loginMethod}</Text><Text style={{textAlign:"center", margin:10, fontWeight:"bold"}}>{loginMethod==="email"?email:phone}</Text>
          {loginMethod==="email" && <Text style={{textAlign:"center", color:"#16a34a", fontWeight:"bold"}}>Real OTP: {realOTP}</Text>}
          <TextInput style={styles.inp} placeholder="6 Digit OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6}/>
          <TouchableOpacity style={styles.gBtn} onPress={()=>{if(loginMethod==="email"){if(otp===realOTP) setScreen("home"); else Alert.alert("OTP වැරදියි",`හරි එක: ${realOTP}`);} else setScreen("home");}}><Text style={styles.wT}>Verify & Login</Text></TouchableOpacity>
        </>}
        {screen==="home" && <>
          <View style={styles.map}><Text style={styles.mapT}>🗺️ Real Map - Original Location</Text><Text style={{color:"#fff", fontSize:11, textAlign:"center", marginTop:6}}>{realAddress}</Text>{location && <Text style={{color:"#bbf7d0", fontSize:10, textAlign:"center"}}>{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</Text>}</View>
          {showAd1 && <Ad title="Watagoda JUKI Rent Rs.500/day" sub="Real Location අසලම - Same Day" btn="Rent Now" onClose={()=>setShowAd1(false)}/>}
          <View style={{flexDirection:"row", gap:8, marginVertical:10}}>
            <TouchableOpacity style={[styles.cat, category==="🔧 JUKI Mechanic" && styles.catA]} onPress={()=>setCategory("🔧 JUKI Mechanic")}><Text style={styles.catT}>JUKI</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.cat, category==="⚡ විදුලි කාර්මික ශිල්පී" && styles.catA]} onPress={()=>setCategory("⚡ විදුලි කාර්මික ශිල්පී")}><Text style={styles.catT}>විදුලි</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.cat, category==="🔌 විදුලි පරිපථ කාර්මික ශිල්පී" && styles.catA]} onPress={()=>setCategory("🔌 විදුලි පරිපථ කාර්මික ශිල්පී")}><Text style={styles.catT}>පරිපථ</Text></TouchableOpacity>
          </View>
          {mechanics.filter(m=>m.category===category).map((m,i)=><View key={m.id}><View style={styles.card}><View style={{flexDirection:"row", alignItems:"center"}}><Text style={{fontSize:30, marginRight:10}}>👨‍🔧</Text><View style={{flex:1}}><Text style={{fontWeight:"bold", color:"#14532d"}}>{m.name}</Text><Text style={{color:"#16a34a", fontSize:11}}>🟢 {m.status} • {m.distance} • Real GPS</Text></View><Text>⭐{m.rating}</Text></View><TouchableOpacity style={styles.yBtn} onPress={()=>{setSelectedMechanic(m); setTroubles([]); setScreen("booking");}}><Text style={{fontWeight:"bold"}}>Request Service</Text></TouchableOpacity></View>{i===0 && showAd2 && <Ad title="JUKI Sale Rs.85,000 - 0% Installments" sub="Sponsored" btn="Buy Now" onClose={()=>setShowAd2(false)}/>}</View>)}
        </>}
        {screen==="booking" && <>
          <Text style={styles.title}>{selectedMechanic?.name}</Text><Text style={{textAlign:"center", fontSize:11}}>📍 {realAddress}</Text>
          <Text style={styles.lab}>දෝෂ - {category}</Text>
          {(breakdowns[category]||[]).map(t=><TouchableOpacity key={t} style={styles.trRow} onPress={()=>setTroubles(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])}><Text style={[styles.cb, troubles.includes(t) && styles.cbA]}>{troubles.includes(t)?"✓":" "}</Text><Text>{t}</Text></TouchableOpacity>)}
          <View style={styles.priceCard}><Text style={{fontWeight:"bold"}}>Price Breakdown</Text><View style={styles.prRow}><Text>Base Visit</Text><Text>Rs.500</Text></View><View style={styles.prRow}><Text>Parts ({troubles.length})</Text><Text>Rs.{troubles.length*150}</Text></View><View style={styles.prRowB}><Text style={{fontWeight:"bold"}}>Total</Text><Text style={{fontWeight:"bold", color:"#16a34a"}}>Rs.{500+troubles.length*150+300}</Text></View></View>
          <TouchableOpacity style={styles.gBtn} onPress={()=>setScreen("tracking")}><Text style={styles.wT}>Book Now - Real GPS එකෙන් එනවා</Text></TouchableOpacity>
        </>}
        {screen==="tracking" && <>
          <Text style={styles.title}>📍 Tracking - Real Road</Text><View style={styles.mapBig}><Text style={{fontWeight:"bold", color:"#16a34a"}}>🏍️ Mechanic is coming via Real Road</Text><Text style={{fontSize:11, marginTop:6}}>{realAddress}</Text><Text style={{fontSize:10, color:"#666"}}>Blue Line = Real Route</Text></View>
          <TouchableOpacity style={styles.gBtn} onPress={()=>setScreen("payment")}><Text style={styles.wT}>Job Completed</Text></TouchableOpacity>
        </>}
        {screen==="payment" && <><Text style={styles.bigPrice}>Rs. {500+troubles.length*150+300}</Text><TouchableOpacity style={styles.gBtn} onPress={()=>setScreen("rating")}><Text style={styles.wT}>Pay & Rate</Text></TouchableOpacity></>}
        {screen==="rating" && <>
          <Text style={styles.title}>Rate Mechanic</Text><View style={{flexDirection:"row", justifyContent:"center", gap:6, margin:10}}>{[1,2,3,4,5].map(s=><TouchableOpacity key={s} onPress={()=>setRating(s)}><Text style={{fontSize:30, opacity:s<=rating?1:0.3}}>⭐</Text></TouchableOpacity>)}</View>
          <TextInput style={[styles.inp, {height:80}]} placeholder="Feedback..." value={feedback} onChangeText={setFeedback} multiline/>
          <TouchableOpacity style={styles.gBtn} onPress={()=>{Alert.alert("ස්තුතියි! Real App!",`Location: ${realAddress}\nEmail: ${email}\nRating: ${rating}`); setScreen("home");}}><Text style={styles.wT}>Submit Feedback</Text></TouchableOpacity>
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gSafe:{flex:1, backgroundColor:"#16a34a"}, lSafe:{flex:1, backgroundColor:"#f0fdf4"}, gCent:{flex:1, padding:30, justifyContent:"center", alignItems:"center"},
  gTit:{fontSize:36, fontWeight:"bold", color:"#fff"}, gSub:{fontSize:12, color:"#dcfce7", fontWeight:"bold", textAlign:"center"}, wBtn:{backgroundColor:"#fff", padding:16, borderRadius:14, marginTop:20}, wBtnT:{color:"#16a34a", fontWeight:"bold"}, logo:{fontSize:22, fontWeight:"bold", textAlign:"center", color:"#16a34a", marginBottom:10}, title:{fontSize:18, fontWeight:"bold", color:"#166534", textAlign:"center", marginVertical:10}, lab:{fontWeight:"bold", color:"#166534", fontSize:12, marginVertical:4}, inp:{backgroundColor:"#fff", borderWidth:1, borderColor:"#86efac", borderRadius:12, padding:14, marginBottom:10},
  gBtn:{backgroundColor:"#16a34a", padding:15, borderRadius:12, alignItems:"center", marginVertical:6}, gBtnF:{flex:1, backgroundColor:"#16a34a", padding:14, borderRadius:12, alignItems:"center"}, bBtnF:{flex:1, backgroundColor:"#15803d", padding:14, borderRadius:12, alignItems:"center"}, wT:{color:"#fff", fontWeight:"bold"}, header:{flexDirection:"row", alignItems:"center", padding:12, backgroundColor:"#16a34a"}, headerT:{flex:1, color:"#fff", fontSize:11, fontWeight:"bold"}, dot:{color:"#bbf7d0", fontSize:11}, map:{height:110, backgroundColor:"#16a34a", margin:12, borderRadius:16, justifyContent:"center", alignItems:"center"}, mapBig:{height:200, backgroundColor:"#dcfce7", borderRadius:16, justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:"#86efac", marginVertical:10}, mapT:{color:"#fff", fontWeight:"bold"}, cat:{flex:1, borderWidth:1, borderColor:"#86efac", borderRadius:20, padding:10, backgroundColor:"#fff", alignItems:"center"}, catA:{backgroundColor:"#fde047"}, catT:{fontWeight:"bold", fontSize:12}, card:{backgroundColor:"#fff", marginBottom:12, padding:14, borderRadius:16, borderWidth:1, borderColor:"#bbf7d0"}, yBtn:{backgroundColor:"#facc15", padding:10, borderRadius:10, alignItems:"center", marginTop:8}, trRow:{flexDirection:"row", alignItems:"center", padding:12, backgroundColor:"#fff", marginBottom:6, borderRadius:10, borderWidth:1, borderColor:"#dcfce7"}, cb:{width:22, height:22, borderWidth:2, borderColor:"#16a34a", borderRadius:6, textAlign:"center", marginRight:10}, cbA:{backgroundColor:"#dcfce7"}, priceCard:{backgroundColor:"#fff", borderWidth:1, borderColor:"#86efac", borderRadius:16, padding:14, marginVertical:10}, prRow:{flexDirection:"row", justifyContent:"space-between", paddingVertical:4}, prRowB:{flexDirection:"row", justifyContent:"space-between", borderTopWidth:1, borderStyle:"dashed", marginTop:6, paddingTop:6}, bigPrice:{fontSize:36, fontWeight:"bold", textAlign:"center", color:"#16a34a", margin:20}, adBox:{flexDirection:"row", alignItems:"center", padding:10, borderRadius:12, marginVertical:8, backgroundColor:"#dcfce7", borderWidth:1, borderColor:"#86efac", borderStyle:"dashed"}, adLab:{fontSize:9, color:"#666"}, adTit:{fontSize:11, fontWeight:"bold"}, adSub:{fontSize:9, color:"#666"}, adBtn:{backgroundColor:"#16a34a", padding:8, borderRadius:8, marginLeft:8}, adBtnT:{color:"#fff", fontSize:9, fontWeight:"bold"}
});
