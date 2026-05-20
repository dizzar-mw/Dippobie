
// Your unique Google Sheet ID
const SHEET_ID = '1dvgO64fHfjDxwMUKuW7Fvq_C8lgsJsF180md8d7Xofg';
const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

async function loadDippobieTracks() {
    try {
        const response = await fetch(csvUrl);
        const data = await response.text();
        
        // Split rows by line breaks
        const lines = data.split('\n').map(line => line.split(','));
        const rows = lines.slice(1); // Skip the header row

        const tracksList = document.getElementById('tracks-list');
        tracksList.innerHTML = ''; // Clear loading placeholder

        rows.forEach((row, index) => {
            // Safety check: skip row if it doesn't have enough columns
            if (row.length < 4 || !row[0]) return; 
            
            // Extract and clean data from rows
            const title = row[0].trim();
            const artist = row[1].trim();
            const audioUrl = row[2].trim();
            const coverUrl = row[3].trim();
            const downloadUrl = row[4] ? row[4].trim() : audioUrl;

            // Generate HTML for the Track Card
            const card = document.createElement('div');
            card.className = 'track-card';
            card.innerHTML = `
                <div class="track-info">
                    <img class="track-cover" src="${coverUrl}" alt="${title} Cover">
                    <div class="track-details">
                        <h3>${title}</h3>
                        <p>${artist}</p>
                    </div>
                </div>
                
                <!-- This div holds the visual audio soundwave -->
                <div id="waveform-${index}" style="margin: 10px 0; background: #111; padding: 5px; border-radius: 4px;"></div>
                
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="download-btn" id="play-${index}" style="background-color: #ff3e3e; color: white; cursor: pointer;">Play</button>
                    <a href="${downloadUrl}" download="${title}.mp3" class="download-btn">Download Song</a>
                </div>
            `;

            tracksList.appendChild(card);

            // Initialize the advanced wave player for this specific song
            const wavesurfer = WaveSurfer.create({
                container: `#waveform-${index}`,
                waveColor: '#4f4f4f',
                progressColor: '#ff3e3e', // Street red progress bar
                cursorColor: '#ffffff',
                barWidth: 3,
                barRadius: 3,
                height: 40,
                responsive: true
            });

            // Load the audio file link from the spreadsheet
            wavesurfer.load(audioUrl);

            // Handle the play/pause interaction
            const playBtn = document.getElementById(`play-${index}`);
            playBtn.addEventListener('click', () => {
                wavesurfer.playPause();
                playBtn.textContent = wavesurfer.isPlaying() ? 'Pause' : 'Play';
                playBtn.style.backgroundColor = wavesurfer.isPlaying() ? '#ffffff' : '#ff3e3e';
                playBtn.style.color = wavesurfer.isPlaying() ? '#000000' : '#ffffff';
            });
        });

        // Trigger smooth entry animation using GSAP
        gsap.from('.track-card', { opacity: 0, y: 40, duration: 0.6, stagger: 0.15 });

    } catch (error) {
        console.error('Error fetching tracks from Google Sheet:', error);
    }
}

// Fire the script as soon as the HTML elements finish loading
window.addEventListener('DOMContentLoaded', loadDippobieTracks);
