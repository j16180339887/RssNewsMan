import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

export default class Setting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rssFeeds: "https://feeds.feedburner.com/techbang"
    }
  }

  componentDidMount() {
    this._loadInitState().done()
  }

  _loadInitState = async() => {
    var rssFeeds = await AsyncStorage.getItem("rssFeeds");
    if (rssFeeds !== null) {
      this.props.navigation.navigate("Profile");
    }
  }

  addNewFeed = () => {
    alert("test")
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.blueText} >app!</Text>
          <TextInput
            style={styles.textInput} placeholder="Input rss"
            onChangeText={ (rssFeeds) => this.setState({rssFeeds}) } />
          <TouchableOpacity style={styles.btn} onPress={this.addNewFeed}>
            <Text>Add Feeds</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#2896d3',
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueText: {
    color: "blue"
  },
  textInput: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
  },
  btn: {
    alignSelf: 'stretch',
    backgroundColor: '#01c853',
    padding: 20,
    alignItems: "center"
  }
});
