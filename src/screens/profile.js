import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Image, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DefaultStrings from '../constants/defaultStrings';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      categories: [],
      imageArray: [],
      profileImage: null,
    }
  }
  render() {
    return (
      <ScrollView style={[styles.container]}>
        <View style={styles.outline}>
          <View style={styles.alignCenter}>
            <TouchableOpacity onPress={() => this.uploadProfileImage()}>
              {this.state.profileImage === null &&
                <View style={styles.thumbnail}>
                  <Avatar.Icon size={40} icon="plus" style={styles.icon} />
                  <Text style={styles.picText}>{DefaultStrings.UPLOAD_PROFILE} {"\n"} {DefaultStrings.PIC}</Text>
                </View>}
              {this.state.profileImage && <View style={styles.thumbnail}>
                <Image style={styles.profileImage} source={{ uri: this.state.profileImage }} />
              </View>}
            </TouchableOpacity>
            <View style={{ width: 200 }}>
              <TextInput
                placeholder="Name"
                placeholderTextColor='#000'
                value={this.state.name}
                style={styles.nameStyle}
                onChangeText={(text) => this.onChangeName(text)}
              />

              <View style={styles.description}>
                <TextInput
                  placeholder="Description"
                  placeholderTextColor='#000'
                  value={this.state.description}
                  onChangeText={(text) => this.onChangeDescription(text)}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.pickerStyle]}>
              <Picker
                selectedValue={this.state.categories}
                style={{ height: 40, width: 300 }}
                placeholder='test'
                itemStyle={{height:50}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setSelectedValue(itemValue)
                }>
                <Picker.Item label="Categories" value="0" />
                <Picker.Item label="Actor" value="Actor" />
                <Picker.Item label="Singer" value="Singer" />
                <Picker.Item label="Producer" value="Producer" />
                <Picker.Item label="Editor" value="Editor" />
                <Picker.Item label="VFS" value="Vfs" />
              </Picker>
            </View>
            <View>
              {this.renderSelectedCategory()}
            </View>
            {this.renderLineSeparator()}
            <View style={{ marginTop: 5 }} >
              {this.renderLineSeparator()}
            </View>

          </View>
          <View style={{
            paddingLeft: 10,
            marginVertical: 10,
          }}>
            <Text style={{
              color: '#000',
              marginVertical: 20,
            }}>{DefaultStrings.ADD_IMAGES_VIDESOS}</Text>

            {this.renderImageView()}

            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => this.pickImage()} style={{ width: 100, height: 100, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar.Icon size={40} icon="plus" style={styles.icon} />
                <Text>{DefaultStrings.UPLOAD}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  /**
   * Ask permission to access photo library
   */
  askCamerPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        return true;
      }
      return false;
    }
  }

  /**
   * pick a image from the gallery
   */
  pickImage = async () => {
    const granted = await this.askCamerPermission();
    if (granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        let newImage = [];
        newImage.push(result.uri);
        this.setState({
          imageArray: [...this.state.imageArray, ...newImage]
        });
      }
    } else {
      alert('Sorry, we need camera roll permissions!')
    }
  };

  /**
   * choose and upload a image in profile picture
   */
  uploadProfileImage = async () => {
    const granted = await this.askCamerPermission();
    if (granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          profileImage: result.uri
        })
      }
    } else {
      alert('Sorry, we need camera roll permissions!')
    }
  }

  /**
   * render image list view
   */
  renderImageView = () => {
    return (
      <View>
        <FlatList
          data={this.state.imageArray}
          renderItem={({ item, index }) => <View>
            <TouchableOpacity onPress={() => this.removeImage(item)} style={styles.cancelIcon}>
              <Avatar.Icon size={22} icon="close" style={[styles.icon]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('imageViewer', { imageArray: this.state.imageArray, index: index }) }}>
              <Image style={styles.image} source={{ uri: item }} />
            </TouchableOpacity>
          </View>}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}

        />
      </View>
    )
  }

  /**
   * update the name value in state
   * @param {string} text 
   */
  onChangeName = (text) => {
    this.setState({
      name: text
    })
  }

  /**
   * update the description in state
   * @param {string} text 
   */
  onChangeDescription = (text) => {
    this.setState({
      description: text
    })
  }

  /**
   * update the category array
   * @param {string} value 
   */
  setSelectedValue = (value) => {
    if (value === '0') { return '' }
    let category = this.state.categories.filter((i) => i === value);
    if (category.length === 0) {
      let newValue = [];
      newValue.push(value);
      this.setState({ categories: [...this.state.categories, ...newValue] })
    }
  }

  /**
   * remove the item from category array
   * @param {string} value 
   */
  removeCategory = (value) => {
    const removeCategoryList = this.state.categories;
    const index = removeCategoryList.indexOf(value);
    if (index > -1) {
      removeCategoryList.splice(index, 1);
    }
    this.setState({ categories: removeCategoryList });
  }

  /**
  * remove the image from the array
  * @param {string} value 
  */
  removeImage = (value) => {
    const removeImage = this.state.imageArray;
    const index = removeImage.indexOf(value);
    if (index > -1) {
      removeImage.splice(index, 1);
    }
    this.setState({ imageArray: removeImage });
  }

  /**
   * render the category selected list
   */
  renderSelectedCategory = () => {
    return (
      <View>
        <FlatList
          data={this.state.categories}
          renderItem={({ item }) => <View style={{ backgroundColor: '#ddd', width: 90, height: 25, borderRadius: 20, margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#000', paddingLeft: 5 }}>{item}</Text>
            <TouchableOpacity onPress={() => this.removeCategory(item)}>
              <Avatar.Icon size={22} icon="close" style={styles.icon} />
            </TouchableOpacity>
          </View>}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  /**
   * render line view
   */
  renderLineSeparator = () => {
    return (
      <View
        style={styles.line}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#7049f6',
    padding: 20,
  },
  headertext: {
    color: '#fff',
    fontSize: 20
  },
  cancelIcon: {
    alignItems: 'flex-end',
    bottom: -15,
    justifyContent: 'flex-end',
    position: 'relative',
    zIndex: 10,
    marginLeft: 85
  },
  pickerStyle: {
    width: 310,
    backgroundColor: '#ddd',
    margin: 10
  },
  imageContainer: {
    marginTop: 20,
    paddingLeft: 5,
    marginBottom: 30
  },
  outline: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    margin: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "contain",
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  description: {
    marginTop: 10,
    backgroundColor: '#ddd',
    height: 70,
    paddingLeft: 10
  },
  nameStyle: {
    height: 40,
    backgroundColor: '#ddd',
    marginTop: 10,
    paddingLeft: 10
  },
  icon: {
    backgroundColor: '#ddd',
    color: '#000'
  },
  picText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 5
  },
  line: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  alignCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
    margin: 1
  }
});
