import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput,ScrollView} from 'react-native';
import React, {useEffect, useState} from "react";
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const STORAGE_KEY = "@toDos"

export default function App() {
  const Stack = createNativeStackNavigator();
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const[toDos,setToDos] = useState({});
  useEffect(()=>{
    loadToDos();
  },[]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => {
    setText(payload)
  };
  const saveToDos = async(toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  
  const addToDo = async() => {
    if(text ===""){
      return;
    }
    const newToDos = {...toDos,[Date.now()]:{text,working},};
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };

  function NewScreen({navigation}){
    return(
      <View style={styles.container}>
        <Text>{onChangeText}</Text>
      </View>
    );
  }
  
  return (
      <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
        <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>육군게시판</Text>
         </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>공군게시판</Text>
      </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addToDo}
          returnKeyLabel = "done"
          placeholder="내용을 입력하세요." 
          style={styles.input}
          multiline
          onChangeText={onChangeText}
          value={text} 
          />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key)=> toDos[key].working === working ? 
        (<View style={styles.toDo} key={key} >
           <Text style={styles.toDoText}>{toDos[key].text}</Text>
        </View>
        ) : null
        )}
      </ScrollView>
    </View>
  );
        }



  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,
    fontSize: 18, 
  },
  btnText:{
    fontSize:25,
    fontWeight: "600",
    color: theme.grey,
  },
  input:{
    backgroundColor: "white", 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 14,
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical:10,
    paddingHorizontal: 40,
    borderRadius: 15,

  },
  toDoText:{
    color: "white",
    fontSize:16,
    fontWeight: "500",
  },
});
