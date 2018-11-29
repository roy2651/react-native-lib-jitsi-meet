/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Dimensions} from 'react-native';
import JitsiMeetJS from './lib-jitsi-meet-swagger';
import { RTCView } from 'react-native-webrtc';
const window = Dimensions.get('window');
const options = {
  hosts: {
      domain: 'meet.roy2651.cn',
      muc: 'conference.meet.roy2651.cn' // FIXME: use XEP-0030
  },
  bosh: 'https://meet.roy2651.cn/http-bind', // FIXME: use xep-0156 for that

  // The name of client node advertised in XEP-0115 'c' stanza
  clientNode: 'http://jitsi.org/jitsimeet'
};
const initOptions = {
  disableAudioLevels: true
};

const confOptions = {
  openBridgeChannel: true
};

let connection = null;
let room = null;
const remoteTracks = {};
const videoURL = null;

function connect() {  
  JitsiMeetJS.init(initOptions);
  connection = new JitsiMeetJS.JitsiConnection(null, null, options);
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess);   
  connection.connect(); 
}

function onLocalTracks(tracks) {
  for (let i = 0; i < tracks.length; i++) {
    room.addTrack(tracks[i]);
  }  
}

function onConferenceJoined() {
  JitsiMeetJS.createLocalTracks({devices: ['video']}, false).then(onLocalTracks).catch(error => console.warn('Exception caught', error));
}

function onConnectionSuccess() {  
  room = connection.initJitsiConference('conference', confOptions); 
  room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined); 
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);  
  room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
      console.log(`track removed!!!${track}`);
  });   
  room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
      console.log('USER_JOINED',id);      
  });   
  room.on(JitsiMeetJS.events.conference.USER_LEFT, id => {

    console.log('USER_LEFT',id);
  }); 
  room.join(); 
  room.setDisplayName('十块钱'); 
}

function onRemoteTrack(track) {  
  container.setState({ videoURL: track.stream.toURL() });
  container.setState({
      status:"sharescreen" 
  });
}
   
var container;
type Props = {};
export default class App extends Component<Props> { 
  constructor(props) {
    super(props);
    this.state = { status: 'init' };
   
  }
  componentDidMount() {
    container = this;
  }
  _onPressButton() {
    connect();
  }
  render() {
    return (
      <View style={styles.container}>
      { this.state.status == 'init' ?
        (<View>
          <Text style={styles.welcome}>remoteTrack</Text>
          <Button
            onPress={this._onPressButton}
            title="开始会议"
          />
        </View>) : null
      }        
      {this.state.status == "sharescreen" ?
        (<View>
          <RTCView streamURL = { this.state.videoURL } style = { {width:window.width, height:window.height, backgroundColor:'black'} }/>
        </View>) : null
      }
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
