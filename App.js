import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [screen, setScreen] = useState("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [realOtp, setRealOtp] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingType, setBookingType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
  }, []);

  const sendOTP = () => {
    if (phone.length < 9) { Alert.alert("Phone එක දාන්න"); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRealOtp(code);
    Alert.alert("MachineGo OTP", `ඔබගේ OTP එක: ${code}`);
    setScreen("otp");
  };

  const verifyOTP = () => {
    if (otpInput === realOtp) { setScreen("home"); }
    else { Alert.alert("වැරදි OTP", `හරි එක: ${realOtp}`); }
  };

  const mechanics = [
    { name: "Kasun JUKI Service", type: "JUKI Mechanic", status: "Online", distance: "1.2 km", rating: "4.9" },
    { name: "Nimal Electrical", type: "Electrician", status: "Online", distance: "2.4 km", rating: "4.8" },
    { name: "Saman Circuit Service", type: "Circuit", status: "Offline", distance: "3.1 km", rating: "4.7" },
  ];

  const SignupScreen = () => (
    <View style={styles.container}>
      <Text style={styles.logo}>MachineGo LK</Text>
      <Text style={styles.subtitle}>Original System - Real Map + OTP</Text>
      <TextInput style={styles.input} placeholder="ඔබේ නම" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="0771234567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TouchableOpacity style={styles.button} onPress={sendOTP}><Text style={styles.buttonText}>Send OTP</Text></TouchableOpacity>
    </View>
  );

  const OTPScreen = () => (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>📱</Text>
      <Text style={styles.title}>OTP: {realOtp}</Text>
      <TextInput style={styles.input} placeholder="6 Digit OTP" keyboardType="number-pad" maxLength={6} value={otpInput} onChangeText={setOtpInput} />
      <TouchableOpacity style={styles.button} onPress={verifyOTP}><Text style={styles.buttonText}>Verify OTP</Text></TouchableOpacity>
      <TouchableOpacity onPress={sendOTP}><Text style={styles.link}>Resend OTP</Text></TouchableOpacity>
    </View>
  );

  const HomeScreen = () => (
    <ScrollView><View style={styles.home}>
      <Text style={styles.logo}>MachineGo</Text>
      <Text style={styles.welcome}>ආයුබෝවන් {name || "Bosa"} 👋</Text>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("JUKI Mechanic"); setScreen("mechanics")}}>
        <Text style={styles.categoryIcon}>🔧</Text><View><Text style={styles.categoryTitle}>JUKI Mechanic</Text><Text>Sewing Machine</Text></View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("Electrician"); setScreen("mechanics")}}>
        <Text style={styles.categoryIcon}>⚡</Text><View><Text style={styles.categoryTitle}>Electrician</Text><Text>Electrical Service</Text></View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.category} onPress={()=>{setCategory("Circuit"); setScreen("mechanics")}}>
        <Text style={styles.categoryIcon}>🔌</Text><View><Text style={styles.categoryTitle}>Circuit PCB</Text><Text>Circuit Service</Text></View>
      </TouchableOpacity>
    </View></ScrollView>
  );

  const MechanicsScreen = () => {
    const list = mechanics.filter(m => category.includes(m.type) || m.type.includes(category) || category === m.type);
    const displayList = list.length > 0 ? list : mechanics;
    return (
      <ScrollView><View style={styles.home}>
        <TouchableOpacity onPress={()=>setScreen("home")}><Text style={styles.back}>← Home</Text></TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
        {displayList.map((m, i) => (
          <View key={i} style={styles.mechanicCard}>
            <Text style={styles.mechanicName}>👨‍🔧 {m.name}</Text>
            <Text>⭐ {m.rating} 📍 {m.distance}</Text>
            <Text style={m.status==="Online"?styles.online:styles.offline}>{m.status==="Online"?"🟢 Online":"🔴 Offline"}</Text>
            <TouchableOpacity style={m.status==="Online"?styles.button:styles.timeButton} onPress={()=>{setSelectedMechanic(m); setScreen(m.status==="Online"?"booking":"arrange")}}>
              <Text style={m.status==="Online"?styles.buttonText:null}>{m.status==="Online"?"Select Mechanic":"📅 Arrange Time"}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View></ScrollView>
    );
  };

  const BookingScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Booking</Text><Text style={styles.selected}>{selectedMechanic?.name}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{setBookingType("Book Now"); setScreen("request")}}><Text style={styles.buttonText}>🚀 Book Now</Text></TouchableOpacity>
      <TouchableOpacity style={styles.timeButton} onPress={()=>setScreen("arrange")}><Text>📅 Arrange Time</Text></TouchableOpacity>
    </View>
  );

  const ArrangeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Arrange Time</Text><Text style={styles.selected}>{selectedMechanic?.name}</Text>
      <TextInput style={styles.input} placeholder="Date - 2026-10-10" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Time - 10:30 AM" value={time} onChangeText={setTime} />
      <TouchableOpacity style={styles.button} onPress={()=>{setBookingType("Arrange Time"); setScreen("request")}}><Text style={styles.buttonText}>Send Request</Text></TouchableOpacity>
    </View>
  );

  const RequestScreen = () => (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>⏳</Text><Text style={styles.title}>Request Sent</Text>
      <Text style={styles.selected}>{selectedMechanic?.name}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("confirm")}><Text style={styles.buttonText}>🔧 Mechanic Accept (Demo)</Text></TouchableOpacity>
    </View>
  );

  const ConfirmScreen = () => (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>✅</Text><Text style={styles.title}>Booking Confirmed!</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("tracking")}><Text style={styles.buttonText}>📍 Track on ORIGINAL MAP</Text></TouchableOpacity>
    </View>
  );

  const TrackingScreen = () => (
    <View style={{flex:1}}>
      <View style={{padding:15, paddingTop:50, backgroundColor:'white'}}>
        <TouchableOpacity onPress={()=>setScreen("home")}><Text style={styles.back}>← Home</Text></TouchableOpacity>
        <Text style={styles.title}>📍 Original Live Map</Text>
        <Text style={{textAlign:'center', fontWeight:'bold'}}>{selectedMechanic?.name} is on the way 🛵</Text>
      </View>
      {location ? (
        <MapView style={{flex:1}} initialRegion={{latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02}} showsUserLocation={true}>
          <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} title="You" description="Customer Location" pinColor="green" />
          <Marker coordinate={{latitude: location.latitude + 0.005, longitude: location.longitude + 0.005}} title={selectedMechanic?.name} description="Mechanic" />
        </MapView>
      ) : (
        <View style={styles.mapBox}><Text>📡 Getting Real GPS Location...</Text></View>
      )}
      <TouchableOpacity style={[styles.button, {margin:15, borderRadius:12}]} onPress={()=>setScreen("complete")}><Text style={styles.buttonText}>Job Completed</Text></TouchableOpacity>
    </View>
  );

  const CompleteScreen = () => (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>🎉</Text><Text style={styles.title}>Job Complete</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("payment")}><Text style={styles.buttonText}>💳 Payment</Text></TouchableOpacity>
    </View>
  );

  const PaymentScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Payment</Text><Text style={styles.price}>Rs. 1,500</Text>
      <TouchableOpacity style={styles.button} onPress={()=>setScreen("rating")}><Text style={styles.buttonText}>Pay & Continue</Text></TouchableOpacity>
    </View>
  );

  const RatingScreen = () => (
    <View style={styles.container}>
      <Text style={styles.bigIcon}>⭐</Text><Text style={styles.title}>Rate Mechanic</Text><Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{Alert.alert("MachineGo", "ස්තුතියි!"); setScreen("home")}}><Text style={styles.buttonText}>Submit Rating</Text></TouchableOpacity>
    </View>
  );

  if (screen==="signup") return <SignupScreen />;
  if (screen==="otp") return <OTPScreen />;
  if (screen==="home") return <HomeScreen />;
  if (screen==="mechanics") return <MechanicsScreen />;
  if (screen==="booking") return <BookingScreen />;
  if (screen==="arrange") return <ArrangeScreen />;
  if (screen==="request") return <RequestScreen />;
  if (screen==="confirm") return <ConfirmScreen />;
  if (screen==="tracking") return <TrackingScreen />;
  if (screen==="complete") return <CompleteScreen />;
  if (screen==="payment") return <PaymentScreen />;
  if (screen==="rating") return <RatingScreen />;
  return null;
}

const styles = StyleSheet.create({
  container: {flex:1, padding:25, justifyContent:"center", backgroundColor:"#f5f7fb"},
  home: {padding:20},
  logo: {fontSize:32, fontWeight:"bold", textAlign:"center", marginBottom:10},
  title: {fontSize:22, fontWeight:"bold", textAlign:"center", marginVertical:12},
  subtitle: {textAlign:"center", color:"#666", marginBottom:20},
  welcome: {fontSize:18, fontWeight:"bold", marginVertical:15},
  input: {backgroundColor:"white", borderWidth:1, borderColor:"#ddd", borderRadius:12, padding:15, marginBottom:15},
  button: {backgroundColor:"#111", padding:16, borderRadius:12, alignItems:"center", marginVertical:8},
  buttonText: {color:"white", fontWeight:"bold"},
  link: {textAlign:"center", marginTop:15, textDecorationLine:"underline"},
  category: {backgroundColor:"white", padding:18, borderRadius:16, marginBottom:12, flexDirection:"row", alignItems:"center", elevation:3},
  categoryIcon: {fontSize:32, marginRight:15},
  categoryTitle: {fontSize:17, fontWeight:"bold"},
  mechanicCard: {backgroundColor:"white", padding:16, borderRadius:16, marginBottom:12, elevation:3},
  mechanicName: {fontSize:17, fontWeight:"bold", marginBottom:5},
  online: {color:"green", fontWeight:"bold", marginTop:5},
  offline: {color:"red", fontWeight:"bold", marginTop:5},
  timeButton: {borderWidth:1, borderColor:"#111", padding:14, borderRadius:12, alignItems:"center", marginTop:10},
  selected: {textAlign:"center", fontWeight:"bold", fontSize:16, marginVertical:10},
  bigIcon: {fontSize:50, textAlign:"center", marginBottom:10},
  mapBox: {flex:1, backgroundColor:"#dfe7d5", justifyContent:"center", alignItems:"center"},
  price: {fontSize:36, fontWeight:"bold", textAlign:"center", margin:20},
  stars: {fontSize:30, textAlign:"center", margin:20},
  back: {fontSize:16, marginBottom:10}
});
