import { DefaultCharacters, DefaultImages } from '../data/defaultData';
import {
  getLocalStorageCharacters,
  getLocalStorageImages,
  saveCharacters,
  saveImages
} from '../data/localStorageManager';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import DrawerContents from '../components/drawerContents';
import FolderList from '../components/images/folder-list';
import Grid from '@mui/material/Grid';
import ImageSender from '../components/images/imageSender';
import ManageCharactersDialog from '../components/characters/manageCharactersDialog';
import NavBar from '../components/navBar';
import Paper from '@mui/material/Paper';
import PlayerDetails from '../components/characters/playerDetails';
import Typography from '@mui/material/Typography';
import { downloadJsonFile } from '../files/fileManager';
import { styled } from '@mui/material/styles';

const DmScreen = () => {
  const pageTitle = 'Dm Screen';

  const broadcastChannel = new BroadcastChannel('auth');

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [manageCharDialogOpen, setManageCharDialogOpen] = useState(false);

  const [images, setImages] = useState(() => {
    return getLocalStorageImages() || DefaultImages();
  });

  const [characters, setCharacters] = useState(() => {
    return getLocalStorageCharacters() || DefaultCharacters();
  });

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  useEffect(() => {
    saveImages(images);
  }, [images]);

  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  /**
   * Opens the player view in a new window/tab
   */
  const handleOpenPlayerView = () => {
    window.open('/dm-screen/players', '_blank');
  };

  /**
   * Open or close the left side menu drawer
   * @param {boolean} open - Whether or not the menu drawer should be open
   */
  const toggleMenuDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleEvent = (item) => {
    sendImageToPlayerView(item);
  };

  const sendImageToPlayerView = (url) => {
    broadcastChannel.postMessage({ cmd: 'image', payload: url });
  };

  const handleExportData = () => {
    downloadJsonFile({ characters: characters, images: images }, 'dm-screen-data.json');
  };

  const handleImportData = () => {
    console.log('import');
  };

  const handleToggleManageCharactersDialog = () => {
    console.log('manage characters');
    setManageCharDialogOpen(true);
    setDrawerOpen(false);
  };

  /**
   * Add a new image to the specified folder
   * @param {string} folderName - The name of the folder to add images to
   * @param {string} url - URL of the image to add
   */
  const handleAddImage = (folderName, url) => {
    if (!url) return;

    const imageFolders = images.map((folder) =>
      folder.folderName === folderName
        ? { ...folder, images: [...folder.images, url] }
        : { ...folder }
    );
    setImages(imageFolders);
  };

  const handleDeleteImage = ({ folderName, url }) => {
    const imageFolders = images.map((folder) =>
      folder.folderName === folderName
        ? { ...folder, images: folder.images.filter((e) => e !== url) }
        : { ...folder }
    );
    setImages(imageFolders);
  };

  const handleAddCharacter = () => {
    const maxId = Math.max(characters.map((c) => c.id)) + 1;
    const newChar = { name: 'New Character', id: maxId };
    setCharacters([...characters, newChar]);
  };

  const handleEditCharacter = (character) => {
    const updatedChars = characters.map((c) =>
      c.id === character.id ? { ...c, ...character } : c
    );
    setCharacters(updatedChars);

    return true;
  };

  const handleDeleteCharacter = (id) => {
    const newCharacters = characters.filter((c) => c.id !== id);
    setCharacters(newCharacters);
  };

  const Section = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%'
  }));

  return (
    <div>
      <Drawer anchor='left' open={drawerOpen} onClose={toggleMenuDrawer(false)}>
        <DrawerContents
          onExport={handleExportData}
          onImport={handleImportData}
          onManageCharacters={handleToggleManageCharactersDialog}
        />
      </Drawer>
      <Box sx={{ flexGrow: 1 }} mb={2}>
        <NavBar onToggleMenuDrawer={toggleMenuDrawer} onOpenPlayerView={handleOpenPlayerView} />
      </Box>
      <Box m={2}>
        <Grid container spacing={2} alignItems='stretch'>
          <Grid item xs={8}>
            <Section>
              <Typography variant='h4'>Characters</Typography>
              <Box m={1}>
                <PlayerDetails characters={characters} />
              </Box>
            </Section>
          </Grid>
          <Grid item xs={4}>
            <Section></Section>
          </Grid>
          <Grid item xs={8}>
            <Section>
              <Typography variant='h4'>Saved Images</Typography>
              <Box m={1}>
                <FolderList
                  folders={images}
                  onSendImage={handleEvent}
                  onAddPhoto={handleAddImage}
                  onDeleteImage={handleDeleteImage}
                />
              </Box>
            </Section>
          </Grid>
          <Grid item xs={4}>
            <Section>
              <ImageSender onSendImage={handleEvent} />
            </Section>
          </Grid>
        </Grid>
      </Box>

      <Box m={2}>
        <Card m={2}></Card>
      </Box>

      <ManageCharactersDialog
        characters={characters}
        isOpen={manageCharDialogOpen}
        handleClose={() => setManageCharDialogOpen(false)}
        onAddCharacter={handleAddCharacter}
        onEditCharacter={handleEditCharacter}
        onDeleteCharacter={handleDeleteCharacter}
      />
    </div>
  );
};

export default DmScreen;
