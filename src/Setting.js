import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Clipboard,
    AsyncStorage
} from 'react-native';

import * as rssParser from 'react-native-rss-parser';

export default class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rssLinks: []
        }
    }

    componentDidMount() {
        this._loadInitState().done()
    }

    _loadInitState = async () => {
        let rssFeeds = await AsyncStorage.getItem("rssFeeds");
        if (rssFeeds !== null) {
            this.props.navigation.navigate("Profile");
        }
    }

    addNewFeed = () => {

        let feeds = [
            {link: "https://feeds.feedburner.com/techbang"},
            // {link: "https://www.gamebase.com.tw/news/rss/0"},
            // {link: "http://news.everydayhealth.com.tw/feed"},
            // {link: "https://feeds.feedburner.com/engadget/cstb"},
            // {link: "https://technews.tw/tn-rss/"},
            // {link: "https://feeds.feedburner.com/pcadv"},
            // {link: "https://feeds.feedburner.com/cool3c-show"},
            // {link: "https://www.ithome.com.tw/rss"},
            // {link: "https://www.kocpc.com.tw/feed"},
            // {link: "http://techcrunch.cn/feed"},
            // {link: "http://www.azofreeware.com/feeds/posts/default"},
            // {link: "https://ithelp.ithome.com.tw/rss/articles/tech"},
            // {link: "https://www.kocpc.com.tw/feed"},
            // {link: "http://www.oschina.net/news/rss"},
            // {link: "https://linux.cn/rss.xml"},
            // {link: "http://feeds.bbci.co.uk/zhongwen/trad/rss.xml"},
            // {link: "https://feeds.feedburner.com/d0od"},
            // {link: "https://www.phoronix.com/rss.php"},
            // {link: "https://feeds.feedburner.com/engadget"},
            // {link: "https://feeds.feedburner.com/TechCrunch"},
            // {link: "https://opensource.com/feed"},
            // {link: "https://feeds.feedburner.com/linuxtoday/linux"},
            // {link: "https://blog.qt.io/feed"},
            // {link: "https://godotengine.org/rss.xml"},
            // {link: "http://feeds.bbci.co.uk/zhongwen/trad/rss.xml"}
        ].map(feed => {
            feed["available"] = true
            return feed
        })

        console.log(feeds)

        Promise
        .all(feeds.map(this.getArticles))
        .then((rssitems) => {
            console.log("All done!")
            console.log(rssitems.length)
            console.log(feeds)
            this.setState({
                rssLinks: [].concat(...rssitems)
                            .filter(e => e != null && e["image"])
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getArticles = url =>
        fetch(url["link"])
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) =>
            Promise
            .all(rss.items.map(this.getImageUrl))
            .then((rssitem) => {
                if (rssitem.filter(e => e["error"]).length > 0) {
                    url["available"] = false
                }
                return rssitem
            })
        )
        .catch((err) => {
            console.log(err)
            url["available"] = false
        })


    getImageUrl = rssitem =>
        fetch(rssitem["links"][0]["url"])
        .then((response) => response.text())
        .then((responseData) => {
            console.log("====================responseData=======================")
            // console.log(responseData)
            let meta = /<meta[^<]*og:image[^<]*>/.exec(responseData)[0]
            if (meta) {
                rssitem["image"] = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i.exec(meta)[0].replace(/&amp;/g, '&')
                // console.log(rssitem["links"][0]["url"])
                // console.log(rssitem["image"])
                // console.log(rssitem)
                console.log("====================END=======================")
                return rssitem
            }
            return {}
        })
        .catch((err) => {
            console.log(err)
            rssitem["error"] = true
            return rssitem
        })

    render() {
        return (
            <View style={{flex: 1, justifyContent:'center', alignItems: 'center', width: '100%'}}>
                <TouchableOpacity style={styles.btn} onPress={this.addNewFeed}>
                    <Text>☰   ↻   ↺   ⌕  ⌖</Text>
                </TouchableOpacity>
                <ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollviewContent} removeclippedsubviews={true}>
                    { this.state.rssLinks.map((rssLink, i) => {
                        console.log({
                            link: rssLink["links"][0]["url"],
                            img: rssLink["image"],
                            title: rssLink["title"]
                        })
                        return (
                            <View key={i} style={{width: '98%', alignItems: 'center', justifyContent: 'center', flex: 1, alignSelf: 'center'}}>
                            <View style={{backgroundColor: 'rgba(0,0,0,0.6)', flex: 1}} >
                                <Image source={{uri: rssLink["image"]}} style={styles.img} contentContainerStyle={{flexGrow: 1}}/>
                            </View>
                                <TouchableOpacity
                                    style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'flex-start'}}
                                    onPress={()=> Clipboard.setString(rssLink["links"][0]["url"])} >
                                        <Text style={styles.imgText}>{rssLink["title"]}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }) }
                    </ScrollView>
                </View>
        )
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.blueText} >app!</Text>
                    <TextInput style={styles.textInput} placeholder="Input rss" onChangeText={ (rssFeeds) => this.setState({rssFeeds}) } />
                    <TouchableOpacity style={styles.btn} onPress={this.addNewFeed}>
                    <Text>☰   ↻   ↺   ⌕  ⌖</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
          )
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
        alignSelf: 'center',
        backgroundColor: '#01c853',
        padding: 20,
        alignItems: "center",
        width: '100%'
    },
    img: {
        flex: 1,
        width: '100%',
        resizeMode: Image.contain,
        aspectRatio: 1,
        opacity: 0.6
    },
    imgText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold'
    },
    scrollview: {
        // paddingVertical: 20,
        // justifyContent: 'center',
        // alignItems: 'center'
        // flex: 1
    },
    scrollviewContent: {
        justifyContent: 'center',
        flexGrow: 1
    },
});
