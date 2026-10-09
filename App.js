import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated, Linking } from "react-native";

export default function App() {
  const [s, setS] = useState("phone");
  const [phone, setPhone] = useState(""); const [whatsApp, setWhatsApp] = useState(""); const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); const [realOtp, setRealOtp] = useState("");
  const [dist, setDist] = useState(""); const [charge, setCharge] = useState(0);
  const [cat, setCat] = useState(""); const [searchCode, setSearchCode] = useState("");
  const [issue, setIssue] = useState(null);
  const [bookingData, setBookingData] = useState(null); // BACK කරත් නැති වෙන්නෙ නෑ!
  const [bookingMode, setBookingMode] = useState("now"); // now or later
  const [laterDate, setLaterDate] = useState(""); const [laterTime, setLaterTime] = useState("");
  const [menu, setMenu] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const marqueeX = useRef(new Animated.Value(0)).current;

  useEffect(()=>{ Animated.loop(Animated.timing(marqueeX, {toValue:-400, duration:9000, useNativeDriver:true})).start(); },[]);

  // TIMER - Mechanic පිට වෙනකන් වැඩ
  useEffect(()=>{
    let interval = null;
    if(s==="mechanicComing" || s==="job"){
      interval = setInterval(()=> setTimerSec(prev=>prev+1), 1000);
    }
    return ()=> clearInterval(interval);
  },[s]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const ss = (sec%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  };

  const fixPhone = (t) => { let p=t.replace(/[^0-9]/g,""); if(p.length===9 && p.startsWith("7")) p="0"+p; if(p.length>10) p=p.slice(0,10); return p; };
  const isRealPhone = (p) => p.length===10 && p.startsWith("07");
  const sendOTP = () => { let r=Math.floor(100000+Math.random()*900000).toString(); setRealOtp(r); setOtp(""); Alert.alert("OTP", "OTP: "+r); };

  // FULL ERROR CODE LIST - අඩු කරපු ඒවා ආපහු දැම්මා
  const JUKI_LIST = [
    {code:"JK-001",name:"Needle Break",price:800}, {code:"JK-002",name:"Thread Jam",price:600},
    {code:"JK-003",name:"Feed Dog Issue",price:700}, {code:"JK-004",name:"Bobbin Winder",price:500},
    {code:"JK-005",name:"Tension Problem",price:650}, {code:"JK-006",name:"Motor Belt Slip",price:900},
    {code:"JK-007",name:"Presser Foot",price:550}, {code:"JK-008",name:"Oil Leak / Service",price:1200},
  ];
  const ELECTRIC_LIST = [
    {code:"EL-001",name:"Wiring Fault",price:1000}, {code:"EL-002",name:"Motor Not Running",price:1200},
    {code:"EL-003",name:"Switch Broken",price:800}, {code:"EL-004",name:"Capacitor Fault",price:1100},
    {code:"EL-005",name:"Carbon Brush",price:900}, {code:"EL-006",name:"Short Circuit",price:1500},
    {code:"EL-007",name:"Plug / Socket",price:600}, {code:"EL-008",name:"Full Electric Service",price:2000},
  ];
  const CIRCUIT_LIST = [
    {code:"CT-001",name:"PCB Burn",price:2000}, {code:"CT-002",name:"Sensor Error E01",price:1500},
    {code:"CT-003",name:"Display Blank",price:1800}, {code:"CT-004",name:"Power Supply Fault",price:1600},
    {code:"CT-005",name:"IC Failure",price:2200}, {code:"CT-006",name:"Relay Not Working",price:1300},
    {code:"CT-007",name:"Program Error",price:2500}, {code:"CT-008",name:"Full Circuit Check",price:3000},
  ];

  const getList = () => {
    let base = cat==="JUKI"? JUKI_LIST : cat==="ELECTRIC"? ELECTRIC_LIST : CIRCUIT_LIST;
    if(!searchCode) return base;
    return base.filter(it=> it.code.toLowerCase().includes(searchCode.toLowerCase()) || it.name.toLowerCase().includes(searchCode.toLowerCase()));
  };

  const getMechanicTitle = () => {
    if(cat==="JUKI") return "JUKI Mechanic";
    if(cat==="ELECTRIC") return "Electrician";
    return "Circuit Mechanic";
  };

  const Header = ({title, back}) => (
    <View style={st.header}>
      <TouchableOpacity onPress={()=>{ if(back) setS(back); else setS("home"); }} style={{padding:5}}>
        <Text style={st.menu}>Back</Text>
      </TouchableOpacity>
      <Text style={[st.ht,{flex:1, textAlign:"center", fontSize:14}]} numberOfLines={1}>{title}</Text>
      <TouchableOpacity onPress={()=>setMenu(!menu)} style={{padding:5}}>
        <Text style={st.menu}>Menu</Text>
      </TouchableOpacity>
    </View>
  );

  const createBooking = (selectedIssue) => {
    const now = new Date().toLocaleString();
    const data = {
      issue: selectedIssue,
      cat, dist, charge,
      bookingTime: now,
      mode: bookingMode,
      laterDate: bookingMode==="later"? laterDate : "",
      laterTime: bookingMode==="later"? laterTime : "",
      total: selectedIssue.price + charge,
      mechanicType: getMechanicTitle()
    };
    setBookingData(data);
    setIssue(selectedIssue);
    setTimerSec(0);
    setIsSearching(true);
    setS("searchingMechanic");
    // Simulate searching 3 sec
    setTimeout(()=>{ setIsSearching(false); setS("mechanicComing"); }, 3000);
  };

  if(s==="phone") return (
    <View style={st.bg}>
      <Text style={st.logo}>MACHINE GO ⚙️</Text>
      <Text style={{textAlign:"center", color:"#2e7d32", fontSize:10, marginBottom:10}}>Original Green Edition</Text>
      <TextInput style={st.input} placeholder="Phone 07xxxxxxxx" value={phone} onChangeText={t=>setPhone(fixPhone(t))} keyboardType="number-pad" maxLength={10}/>
      <TextInput style={st.input} placeholder="WhatsApp" value={whatsApp} onChangeText={t=>setWhatsApp(fixPhone(t))} keyboardType="number-pad" maxLength={10}/>
      <TextInput style={st.input} placeholder="Email" value={email} onChangeText={setEmail}/>
      <TouchableOpacity style={st.btn} onPress={()=>{if(!isRealPhone(phone)){Alert.alert("Phone Error"); return} sendOTP(); setS("otp");}}><Text style={st.bt}>SEND OTP</Text></TouchableOpacity>
    </View>
  );

  if(s==="otp") return (
    <View style={st.bg}>
      <Header title="Verify OTP" back="phone"/>
      <View style={{marginTop:30}}>
        <Text style={st.t}>{phone} OTP</Text>
        <TextInput style={st.input} placeholder="6 Digit" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6}/>
        <TouchableOpacity style={st.btn} onPress={()=>{if(otp!==realOtp){Alert.alert("Wrong OTP"); return} setS("home")}}><Text style={st.bt}>VERIFY</Text></TouchableOpacity>
      </View>
    </View>
  );

  if(s==="home") return (
    <ScrollView style={{flex:1, backgroundColor:"#e8f5e9"}}>
      <View style={st.header}><TouchableOpacity onPress={()=>setMenu(!menu)}><Text style={st.menu}>Menu</Text></TouchableOpacity><Text style={st.ht}>MACHINE GO ⚙️</Text><TouchableOpacity onPress={()=>setS("chat")}><Text style={st.menu}>Chat</Text></TouchableOpacity></View>
      {menu && <View style={st.mbox}><Text style={st.mi} onPress={()=>setS("phone")}>Logout</Text><Text style={[st.mi,{color:"red"}]} onPress={()=>setMenu(false)}>Close</Text></View>}

      <View style={st.adLineBox}><Animated.Text style={[st.adt, {transform:[{translateX:marqueeX}]}]}>MACHINE GO - JUKI 20% OFF - Valvettithurai - 24 Hours Online Service</Animated.Text></View>

      {/* MAP FIX - ONLINE WORKS */}
      <Text style={st.mt}>Live Location - Online Map</Text>
      <View style={st.mapOnline}>
        <Text style={{fontSize:40}}>📍🗺️</Text>
        <Text style={{fontWeight:"bold", color:"#1b5e20", marginTop:5}}>Valvettithurai 9.8167, 80.1667</Text>
        <Text style={{fontSize:10, color:"#555"}}>Online Google Map Ready</Text>
        <TouchableOpacity style={st.mapBtn} onPress={()=>Linking.openURL("https://www.google.com/maps/search/?api=1&query=9.8167,80.1667")}>
          <Text style={{color:"white", fontWeight:"bold", fontSize:12}}>OPEN LIVE GOOGLE MAP</Text>
        </TouchableOpacity>
      </View>

      <View style={st.distBox}>
        <Text style={st.distTitle}>Select Distance</Text>
        <View style={st.row}>
          <TouchableOpacity style={[st.dbox, dist==="near"&&{backgroundColor:"#1b5e20"}]} onPress={()=>{setDist("near"); setCharge(500)}}><Text style={[st.dboxText, dist==="near"&&{color:"white"}]}>Near</Text><Text style={[st.price, dist==="near"&&{color:"white"}]}>Rs.500</Text></TouchableOpacity>
          <TouchableOpacity style={[st.dbox, dist==="mid"&&{backgroundColor:"#1b5e20"}]} onPress={()=>{setDist("mid"); setCharge(750)}}><Text style={[st.dboxText, dist==="mid"&&{color:"white"}]}>Medium</Text><Text style={[st.price, dist==="mid"&&{color:"white"}]}>Rs.750</Text></TouchableOpacity>
          <TouchableOpacity style={[st.dbox, dist==="far"&&{backgroundColor:"#1b5e20"}]} onPress={()=>{setDist("far"); setCharge(1000)}}><Text style={[st.dboxText, dist==="far"&&{color:"white"}]}>Far</Text><Text style={[st.price, dist==="far"&&{color:"white"}]}>Rs.1000</Text></TouchableOpacity>
        </View>

        {/* BOOKING MODE - NOW vs LATER */}
        <Text style={[st.distTitle,{marginTop:12}]}>Booking Type</Text>
        <View style={st.row}>
          <TouchableOpacity style={[st.dbox, {width:110}, bookingMode==="now"&&{backgroundColor:"#1b5e20"}]} onPress={()=>setBookingMode("now")}><Text style={[st.dboxText, bookingMode==="now"&&{color:"white"}]}>Online Now</Text></TouchableOpacity>
          <TouchableOpacity style={[st.dbox, {width:110}, bookingMode==="later"&&{backgroundColor:"#1b5e20"}]} onPress={()=>setBookingMode("later")}><Text style={[st.dboxText, bookingMode==="later"&&{color:"white"}]}>Date & Time</Text></TouchableOpacity>
        </View>
        {bookingMode==="later" && (
          <View style={{flexDirection:"row", gap:6, marginTop:8}}>
            <TextInput style={[st.input,{flex:1, marginBottom:0}]} placeholder="Date ex: 2026-05-13" value={laterDate} onChangeText={setLaterDate}/>
            <TextInput style={[st.input,{flex:1, marginBottom:0}]} placeholder="Time ex: 10 AM" value={laterTime} onChangeText={setLaterTime}/>
          </View>
        )}
      </View>

      <View style={st.row}>
        <TouchableOpacity style={st.box} onPress={()=>{if(!charge){Alert.alert("Select Distance"); return} setCat("JUKI"); setSearchCode(""); setS("list")}}><Text style={{fontSize:22}}>🧵</Text><Text style={st.boxText}>JUKI</Text></TouchableOpacity>
        <TouchableOpacity style={st.box} onPress={()=>{if(!charge){Alert.alert("Select Distance"); return} setCat("ELECTRIC"); setSearchCode(""); setS("list")}}><Text style={{fontSize:22}}>⚡</Text><Text style={st.boxText}>ELECTRIC</Text></TouchableOpacity>
        <TouchableOpacity style={st.box} onPress={()=>{if(!charge){Alert.alert("Select Distance"); return} setCat("CIRCUIT"); setSearchCode(""); setS("list")}}><Text style={{fontSize:22}}>🔌</Text><Text style={st.boxText}>CIRCUIT</Text></TouchableOpacity>
      </View>

      {bookingData && (
        <View style={[st.distBox,{borderColor:"#ff9800", borderWidth:2}]}>
          <Text style={st.distTitle}>Active Booking - Cancel වෙන්නෙ නෑ Back කරාම</Text>
          <Text style={{fontSize:11}}>{bookingData.cat} - {bookingData.issue.name} - Rs.{bookingData.total}</Text>
          <Text style={{fontSize:10}}>{bookingData.bookingTime} - {bookingData.mechanicType} Searching...</Text>
          <TouchableOpacity style={[st.btn,{backgroundColor:"#c62828", padding:8, marginTop:6}]} onPress={()=>setS("mechanicComing")}><Text style={st.bt}>VIEW BOOKING</Text></TouchableOpacity>
        </View>
      )}
      <View style={{height:40}}/>
    </ScrollView>
  );

  if(s==="list") return (
    <ScrollView style={{flex:1, backgroundColor:"#e8f5e9"}}>
      <Header title={cat+" Service"} back="home"/>
      <View style={{padding:10}}>
        <TextInput style={st.input} placeholder="Search Error Code / Name ex: JK-001" value={searchCode} onChangeText={setSearchCode}/>
      </View>
      {getList().map((it,i)=>(
        <View key={i} style={st.card}>
          <View style={{flex:1}}>
            <Text style={st.cardTitle}>{it.code} - {it.name}</Text>
            <Text style={st.cardPrice}>Rs.{it.price+charge} (Service + Distance)</Text>
          </View>
          <TouchableOpacity style={st.smallBtn} onPress={()=>createBooking(it)}><Text style={st.smallBt}>BOOK NOW</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  if(s==="searchingMechanic") return (
    <View style={st.bg}>
      <Header title="Searching..." back="home"/>
      <View style={st.centerBox}>
        <Text style={{fontSize:60}}>🔍</Text>
        <Text style={st.t}>{bookingData?.mechanicType} Searching...</Text>
        <Text style={st.timeText}>{bookingData?.cat} - {bookingData?.issue.name}</Text>
        <Text style={st.liveText}>Please Wait - Online Search</Text>
      </View>
      <TouchableOpacity style={[st.btn,{backgroundColor:"#c62828"}]} onPress={()=>{ setBookingData(null); setS("home"); Alert.alert("Booking Cancelled"); }}>
        <Text style={st.bt}>CANCEL BOOKING</Text>
      </TouchableOpacity>
    </View>
  );

  if(s==="mechanicComing") return (
    <View style={st.bg}>
      <Header title="Mechanic On Way" back="home"/>
      <View style={st.centerBox}>
        <Text style={{fontSize:60}}>🛵</Text>
        <Text style={st.t}>{bookingData?.mechanicType} Coming</Text>
        <Text style={st.timeText}>Booked: {bookingData?.bookingTime}</Text>
        {bookingData?.mode==="later" && <Text style={st.timeText}>Scheduled: {bookingData?.laterDate} {bookingData?.laterTime}</Text>}
        <Text style={st.liveText}>● Live Timer: {formatTimer(timerSec)} - Safety Timer ON</Text>
        <Text style={{fontSize:10, color:"#1b5e20", marginTop:6, fontWeight:"bold"}}>Timer වැඩ කරනවා Mechanic පිට වෙනකන් - Safety</Text>
      </View>
      <TouchableOpacity style={[st.btn,{backgroundColor:"#c62828"}]} onPress={()=>{ setBookingData(null); setTimerSec(0); setS("home"); Alert.alert("Booking Cancelled"); }}>
        <Text style={st.bt}>CANCEL BOOKING</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[st.btn,{backgroundColor:"#1b5e20", marginTop:10}]} onPress={()=>setS("mechanicArrivedConfirm")}>
        <Text style={st.bt}>MECHANIC ARRIVED</Text>
      </TouchableOpacity>
    </View>
  );

  if(s==="mechanicArrivedConfirm") return (
    <View style={st.bg}>
      <Header title="Mechanic Arrived" back="mechanicComing"/>
      <View style={st.centerBox}>
        <Text style={{fontSize:50}}>👨‍🔧</Text>
        <Text style={st.t}>Mechanic Arrived at Location</Text>
        <Text style={st.timeText}>Booking: {bookingData?.bookingTime} | Timer: {formatTimer(timerSec)}</Text>
      </View>
      <TouchableOpacity style={st.btn} onPress={()=>setS("job")}><Text style={st.bt}>CONFIRM & START JOB</Text></TouchableOpacity>
    </View>
  );

  if(s==="job") return (
    <View style={st.bg}>
      <Header title="Job Progress" back="mechanicArrivedConfirm"/>
      <View style={{marginTop:10}}>
        <View style={st.timeBox}><Text style={{fontSize:11, textAlign:"center"}}>Book: {bookingData?.bookingTime} | Safety Timer: {formatTimer(timerSec)}</Text></View>
        <View style={[st.centerBox,{padding:12}]}>
          <Text style={{fontWeight:"bold", color:"#1b5e20"}}>Job Started - Timer ON</Text>
          <Text style={{fontSize:24, fontWeight:"bold", color:"#1b5e20", marginTop:5}}>{formatTimer(timerSec)}</Text>
          <Text style={{fontSize:10}}>Customer / Mechanic / Admin Safety Timer</Text>
        </View>
        <TouchableOpacity style={[st.btn,{backgroundColor:"#1b5e20", marginTop:20}]} onPress={()=>setS("complete")}><Text style={st.bt}>FINISH JOB - STOP TIMER</Text></TouchableOpacity>
        <TouchableOpacity style={[st.btn,{backgroundColor:"#c62828"}]} onPress={()=>{ setBookingData(null); setTimerSec(0); setS("home"); }}><Text style={st.bt}>EMERGENCY CANCEL</Text></TouchableOpacity>
      </View>
    </View>
  );

  if(s==="complete") return (
    <View style={st.bg}>
      <Header title="Job Complete" back="home"/>
      <View style={st.centerBox}>
        <Text style={{fontSize:60}}>🎉</Text>
        <Text style={st.t}>Job Completed Successfully!</Text>
        <View style={st.billBox}>
          <Text>Book Time: {bookingData?.bookingTime}</Text>
          {bookingData?.mode==="later" && <Text>Schedule: {bookingData?.laterDate} {bookingData?.laterTime}</Text>}
          <Text>Work Time: {formatTimer(timerSec)} (Safety Timer)</Text>
          <Text style={{fontWeight:"bold", marginTop:10, color:"#2e7d32"}}>{bookingData?.issue.name} - Paid Rs.{bookingData?.total}</Text>
          <Text style={{fontSize:10, marginTop:5}}>{bookingData?.mechanicType} - Valvettithurai Service Done</Text>
        </View>
      </View>
      <TouchableOpacity style={st.btn} onPress={()=>{ setBookingData(null); setTimerSec(0); setS("home"); }}><Text style={st.bt}>GO TO HOME</Text></TouchableOpacity>
    </View>
  );

  return (<View style={st.bg}><Text>Loading...</Text></View>);
}

const st = StyleSheet.create({
  bg:{flex:1, padding:20, justifyContent:"center", backgroundColor:"#e8f5e9"},
  logo:{fontSize:22, fontWeight:"900", textAlign:"center", color:"#1b5e20"},
  t:{fontSize:16, fontWeight:"bold", textAlign:"center", margin:10, color:"#1b5e20"},
  timeText:{fontSize:11, textAlign:"center", color:"#555"}, liveText:{fontSize:11, textAlign:"center", color:"#2e7d32", fontWeight:"bold", marginTop:5},
  timeBox:{backgroundColor:"white", padding:10, borderRadius:10, marginBottom:10, borderWidth:1, borderColor:"#a5d6a7"},
  centerBox:{backgroundColor:"white", padding:20, borderRadius:20, marginVertical:15, alignItems:"center", borderWidth:2, borderColor:"#a5d6a7"},
  billBox:{backgroundColor:"#f1f8e9", padding:15, borderRadius:12, marginTop:15, width:"100%", borderWidth:1, borderColor:"#c5e1a5"},
  input:{backgroundColor:"white", borderRadius:12, padding:12, marginBottom:8, borderWidth:1.5, borderColor:"#a5d6a7"},
  btn:{backgroundColor:"#2e7d32", padding:14, borderRadius:12, alignItems:"center", marginVertical:5},
  bt:{color:"white", fontWeight:"bold"},
  header:{flexDirection:"row", justifyContent:"space-between", backgroundColor:"#1b5e20", padding:12, paddingTop:40, alignItems:"center"},
  menu:{color:"white", fontWeight:"bold", fontSize:12}, ht:{color:"white", fontWeight:"bold", fontSize:14},
  mbox:{backgroundColor:"white", margin:10, borderRadius:12, padding:5, elevation:5}, mi:{padding:12, borderBottomWidth:1, fontWeight:"bold", color:"#2e7d32"},
  adLineBox:{backgroundColor:"#1b5e20", height:28, justifyContent:"center"}, adt:{color:"#a5d6a7", fontWeight:"bold", width:900, fontSize:11},
  mt:{marginLeft:12, fontWeight:"bold", color:"#2e7d32", marginTop:8, fontSize:11},
  mapOnline:{backgroundColor:"white", margin:10, height:150, borderRadius:16, borderWidth:2, borderColor:"#2e7d32", alignItems:"center", justifyContent:"center"},
  mapBtn:{backgroundColor:"#1b5e20", paddingHorizontal:16, paddingVertical:8, borderRadius:20, marginTop:8},
  distBox:{backgroundColor:"white", margin:10, padding:10, borderRadius:14, borderWidth:2, borderColor:"#2e7d32"},
  distTitle:{fontWeight:"bold", color:"#1b5e20", textAlign:"center", marginBottom:6, fontSize:12},
  row:{flexDirection:"row", justifyContent:"space-around", padding:4},
  dbox:{backgroundColor:"#e8f5e9", width:88, padding:8, borderRadius:12, alignItems:"center", borderWidth:1.5, borderColor:"#c8e6c9"},
  dboxText:{fontWeight:"bold", fontSize:10, color:"#1b5e20"}, price:{fontSize:10, color:"#1b5e20", fontWeight:"bold"},
  box:{backgroundColor:"white", width:92, height:68, borderRadius:16, alignItems:"center", justifyContent:"center", borderWidth:1.5, borderColor:"#a5d6a7"},
  boxText:{fontSize:10, fontWeight:"bold", color:"#1b5e20", marginTop:2},
  card:{backgroundColor:"white", flexDirection:"row", padding:12, marginHorizontal:10, marginVertical:4, borderRadius:14, borderLeftWidth:5, borderLeftColor:"#2e7d32", alignItems:"center"},
  cardTitle:{fontWeight:"bold", fontSize:12, color:"#1b5e20"}, cardPrice:{fontSize:10, color:"#555"},
  smallBtn:{backgroundColor:"#2e7d32", paddingHorizontal:12, paddingVertical:7, borderRadius:10}, smallBt:{color:"white", fontSize:10, fontWeight:"bold"}
});
