
// Client ID and API key from the Developer Console
 const CLIENT_ID = '76828026328-cftjt162f1uec1pqj0o30tt1s2om79s0.apps.googleusercontent.com';

 // Array of API discovery doc URLs for APIs used by the quickstart
 const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

 // Authorization scopes required by the API. If using multiple scopes,
 // separated them with spaces.
 const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

 const authorizeButton = document.getElementById('authorize-button');
 const signoutButton = document.getElementById('signout-button');
 const content = document.getElementById('content');
 const channelForm  = document.getElementById('channel-form');
 const channelInput = document.getElementById('channel-input');
 const videoContainer = document.getElementById('video-container');
 const defaultChannel = 'techguyweb';

 // Form submit and change channel
 channelForm.addEventListener('submit', e => {
     e.preventDefault();
     const channel = channelInput.value;

     getChannel(channel);
 })

 /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then( () => {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

       /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          content.style.display = 'block';
          videoContainer.style.display = 'block';
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
          content.style.display = 'none';
          videoContainer.style.display = 'none';
        }
      }

       /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        gapi.auth2.getAuthInstance().signOut();
      }

      //Display channel data
      function showChannelData(data) {
          const channelData = document.getElementById('channel-data');
          channelData.innerHTML = data;
      }

      /**
       * Print files.
       */
      function getChannel(channel) {
        gapi.client.youtube.channels.list({
          part: 'snippet,contentDetails,statistics',
          forUsername: channel
        }).then(response =>{
            const channel = response.result.items[0];
            const output = `
            <ul class="collection">
                <li class="collection-item">Title: ${channel.snippet.title}</li>
                <li class="collection-item">ID: ${channel.id}</li>
                <li class="collection-item">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
                <li class="collection-item">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
                <li class="collection-item">Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit channel</a>
            `;
            showChannelData(output);

            const playlistId = channel.contentDetails.relatedPlaylist.uploads;
            console.log(playlistId);
            requestVideoPlaylist(playlistId);
        })
        .catch(err => alert(err));
      }

      // Add commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function requestVideoPlaylist(playlistId) {
      console.log('lets go '+playlistId);
      const requestOptions = {
          playlistId: playlistId,
          part: 'snippet',
          maxResults: 20
      };

      const request = gapi.client.youtube.playlistItems.list(requestOptions);

      request.execute(response => {
          console.log(response);
      })
  }