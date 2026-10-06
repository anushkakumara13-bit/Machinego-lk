import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [screen, setScreen] = useState("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [realOtp, setRealOtp] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Customer Location - Valvettithurai
  const customerLat = 9.8167;
  const customerLng = 80.1667;

  const sendOTP = () => {
    if (phone.length < 9) { Alert.alert("Phone එක දාන්න"); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRealOtp(code);
    Alert.alert("MachineGo OTP", `OTP එක: ${code}`);
    setScreen("otp");
  };
  const verifyOTP = () => {
    if (otpInput === realOtp) setScreen("home");
    else Alert.alert("වැරදියි", `හරි එක: ${realOtp}`);
  };

  const mechanics = [
    { name: "Kasun JUKI Service", type: "JUKI", status: "Online", dist: "1.2 km", rating: "4.9", lat: customerLat + 0.005, lng: customerLng + 0.005 },
    { name: "Nimal Electrical", type: "Electrician", status: "Online", dist: "2.0 km", rating: "4.8", lat: customerLat + 0.008, lng: customerLng + 0.002 },
    { name: "Saman Circuit", type: "Circuit", status: "Offline", dist: "3.1 km", rating: "4.7", lat: customerLat + 0.01, lng: customerLng - 0.003 },
  ];

  const TrackingScreen = () => {
    const mech = selectedMechanic;
    const html = `
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body{margin:0} #map{width:100%;height:100vh}</style></head>
      <body><div id="map"></div>
      <script>
        var map = L.map('map').setView([${customerLat}, ${customerLng}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19}).addTo(map);
        var custIcon = L.divIcon({html:'<div style="background:green;color:white;padding:5px 8px;border-radius:10px;font-weight:bold">📍 YOU</div>'});
        var mechIcon = L.divIcon({html:'<div style="background:red;color:white;padding:5px 8px;border-radius:10px;font-weight:bold">🔧 ${mech?.name}</div>'});
        L.marker([${customerLat}, ${customerLng}], {icon:custIcon}).addTo(map).bindPopup("Customer - ${name}<br>Valvettithurai").openPopup();
        L.marker([${mech?.lat}, ${mech?.lng}], {icon:mechIcon}).addTo(map).bindPopup("${mech?.name}<br>⭐${mech?.rating} - ${mech?.dist}");
        var latlngs = [[${customerLat}, ${customerLng}], [${mech?.lat}, ${mech?.lng}]];
        L.polyline(latlngs, {color:'blue', dashArray:'10,10'}).addTo(map);
        map.fitBounds(latlngs, {padding:[50,50]});
      </script></body></html>
    `;
    return (
      <View style={{flex:1, paddingTop:40}}>
        <View style={{padding:15, backgroundColor:'white'}}>
          <TouchableOpacity onPress={()=>setScreen("home")}><Text style={styles.back}>← Home</Text></TouchableOpacity>
          <Text style={styles.title}>📍 REAL LIVE TRACKING</Text>
          <Text style={{textAlign:'center', fontWeight:'bold'}}>{mech?.name} එනවා 🛵 - {mech?.dist}</Text>
        </View>
        <WebView source={{ html }} style={{flex:1}} />
        <View style={{padding:12, backgroundColor:'white', flexDirection:'row', justifyContent:'space-around'}}>
          <Text>🟢 You</Text><Text>🔵 Road</Text><Text>🔴 Mechanic</Text>
        </View>
        <TouchableOpacity style={[styles.button, {margin:10, borderRadius:12}]} onPress={()=>setScreen("complete")}><Text style={styles.buttonText}>✅ Job Completed</Text></TouchableOpacity>
      </View>
    );
  };

  if (screen==="signup") return (
    <View style={styles.container}>
      <Text style={styles.logo}>MachineGo LK</Text><Text style={styles.sub}>100% REAL - No Fake</Text>
      <TextInput style={styles.input} placeholder="ඔබේ නම" value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder="0771234567" keyboardType="phone-pad" value={phone} onChangeText={setPhone}/>
      <TouchableOpacity style={styles.button} onPress={sendOTP}><Text style={styles.buttonText}>Send OTP</Text></TouchableOpacity>
    </View>
  );
  if (screen==="otp") return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP: {realOtp}</Text>
      <TextInput style={styles.input} placeholder="6 Digit" keyboardType="number-pad" maxLength={6} value={otpInput} onChangeText={setOtpInput}/>
      <TouchableOpacity style={styles.button} onPress={verifyOTP}><Text style={styles.buttonText}>Verify</Text></TouchableOpacity>
    </View>
  );
  if (screen==="home") return (
    <ScrollView><View style={styles.home}>
      <Text style={styles.logo}>MachineGo</Text><Text style={styles.welcome}>ආයුබෝවන් {name} 👋</Text>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("JUKI"); setScreen("mechanics")}}><Text style={styles.catIcon}>🔧</Text><View><Text style={styles.catTitle}>JUKI Mechanic</Text><Text>Juki Machine Repair</Text></View></TouchableOpacity>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("Electrician"); setScreen("mechanics")}}><Text style={styles.catIcon}>⚡</Text><View><Text style={styles.catTitle}>Electrician</Text><Text>Electrical Service</Text></View></TouchableOpacity>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("Circuit"); setScreen("mechanics")}}><Text style={styles.catIcon}>🔌</Text><View><Text style={styles.catTitle}>Circuit PCB</Text><Text>Circuit Repair</Text></View></TouchableOpacity>
    </View></ScrollView>
  );
  if (screen==="mechanics") return (
    <ScrollView><View style={styles.home}>
      <TouchableOpacity onPress={()=>setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>{category} Mechanics</Text>
      {mechanics.filter(m=>category==="JUKI"?m.type==="JUKI":category==="Electrician"?m.type==="Electrician":true).map((m,i)=>(
        <View key={i} style={styles.mechanicCard}>
          <Text style={styles.mechanicName}>👨‍🔧 {m.name}</Text>
          <Text>⭐ {m.rating} | 📍 {m.dist}</Text>
          <Text style={m.status==="Online"?styles.online:styles.offline}>{m.status==="Online"?"🟢 Online - දැන් වැඩ":"🔴 Offline"}</Text>
          <TouchableOpacity style={m.status==="Online"?styles.button:styles.timeButton} onPress={()=>{setSelectedMechanic(m); setScreen(m.status==="Online"?"booking":"arrange")}}><Text style={m.status==="Online"?styles.buttonText:null}>{m.status==="Online"?"Select Mechanic":"📅 Arrange Time"}</Text></TouchableOpacity>
        </View>
      ))}
    </View></ScrollView>
  );
  if (screen==="booking") return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking</Text><Text style={styles.selected}>{selectedMechanic?.name}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("request")}><Text style={styles.buttonText}>🚀 Book Now - Real Request</Text></TouchableOpacity>
      <TouchableOpacity style={styles.timeButton} onPress={()=>setScreen("arrange")}><Text>📅 Arrange Time</Text></TouchableOpacity>
    </View>
  );
  if (screen==="arrange") return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Arrange</Text><Text style={styles.selected}>{selectedMechanic?.name}</Text>
      <TextInput style={styles.input} placeholder="Date - 2026-10-10" value={date} onChangeText={setDate}/>
      <TextInput style={styles.input} placeholder="Time - 10:30 AM" value={time} onChangeText={setTime}/>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("request")}><Text style={styles.buttonText}>Send Request</Text></TouchableOpacity>
    </View>
  );
  if (screen==="request") return (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>⏳</Text><Text style={styles.title}>Request Sent to {selectedMechanic?.name}</Text><Text style={{textAlign:'center'}}>Mechanic Online නම් Accept කරයි</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("confirm")}><Text style={styles.buttonText}>🔧 Mechanic Accept (Demo)</Text></TouchableOpacity>
    </View>
  );
  if (screen==="confirm") return (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>✅</Text><Text style={styles.title}>Booking Confirmed!</Text><Text style={styles.selected}>{selectedMechanic?.name} Accepted!</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("tracking")}><Text style={styles.buttonText}>📍 Track on REAL MAP</Text></TouchableOpacity>
    </View>
  );
  if (screen==="tracking") return <TrackingScreen />;
  if (screen==="complete") return (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>🎉</Text><Text style={styles.title}>Job Complete</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("payment")}><Text style={styles.buttonText}>💳 Payment</Text></TouchableOpacity>
    </View>
  );
  if (screen==="payment") return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Payment</Text><Text style={styles.price}>Rs. 1,500</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("rating")}><Text style={styles.buttonText}>Pay & Rate</Text></TouchableOpacity>
    </View>
  );
  if (screen==="rating") return (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>⭐</Text><Text style={styles.title}>Rate {selectedMechanic?.name}</Text><Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{Alert.alert("ස්තුතියි!", "MachineGo LK"); setScreen("home")}}><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
    </View>
  );
  return null;
}

const styles = StyleSheet.create({
  container:{flex:1, padding:25, justifyContent:"center", backgroundColor:"#f5f7fb"},
  home:{padding:20},
  logo:{fontSize:32, fontWeight:"bold", textAlign:"center", marginBottom:5},
  sub:{textAlign:"center", color:"green", fontWeight:"bold", marginBottom:20},
  title:{fontSize:20, fontWeight:"bold", textAlign:"center", marginVertical:10},
  input:{backgroundColor:"white", borderWidth:1, borderColor:"#ddd", borderRadius:12, padding:15, marginBottom:12},
  button:{backgroundColor:"#111", padding:16, borderRadius:12, alignItems:"center", marginVertical:8},
  buttonText:{color:"white", fontWeight:"bold"},
  category:{backgroundColor:"white", padding:18, borderRadius:16, marginBottom:12, flexDirection:"row", alignItems:"center", elevation:3},
  catIcon:{fontSize:32, marginRight:15},
  catTitle:{fontSize:17, fontWeight:"bold"},
  mechanicCard:{backgroundColor:"white", padding:16, borderRadius:16, marginBottom:12, elevation:3},
  mechanicName:{fontSize:16, fontWeight:"bold", marginBottom:4},
  online:{color:"green", fontWeight:"bold", marginTop:5},
  offline:{color:"red", fontWeight:"bold", marginTop:5},
  timeButton:{borderWidth:1, borderColor:"#111", padding:14, borderRadius:12, alignItems:"center", marginTop:10},
  selected:{textAlign:"center", fontWeight:"bold", marginVertical:8},
  back:{fontSize:16, marginBottom:8},
  bigIcon:{fontSize:50, textAlign:"center", marginBottom:10},
  welcome:{fontSize:16, fontWeight:"bold", marginVertical:10},
  price:{fontSize:36, fontWeight:"bold", textAlign:"center", margin:20},
  stars:{fontSize:30, textAlign:"center", margin:15}
});
