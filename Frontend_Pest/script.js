document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('previewImage');
    const resultSection = document.getElementById('resultSection');
    const uploadSection = document.getElementById('uploadSection');
    const uploadBtn = document.querySelector('.upload-btn');
    const confidenceMeter = document.getElementById('confidenceMeter');

    // Common crop pests and their recommendations
    const pestDatabase = {
        'aphid': {
            type: 'Aphid',
            confidence: '92%',
            recommendation: 'Apply neem oil spray or introduce ladybugs as natural predators. Monitor plant growth regularly.',
            additionalInfo: 'Aphids are small, soft-bodied insects that can cause significant damage to crops by sucking plant sap and transmitting viruses.'
        },
        'caterpillar': {
            type: 'Caterpillar',
            confidence: '88%',
            recommendation: 'Use Bacillus thuringiensis (Bt) spray. Remove by hand if infestation is small.',
            additionalInfo: 'Caterpillars are the larval stage of butterflies and moths, known for their voracious appetite for leaves and stems.'
        },
        'whitefly': {
            type: 'Whitefly',
            confidence: '95%',
            recommendation: 'Use yellow sticky traps and apply insecticidal soap. Maintain proper plant spacing.',
            additionalInfo: 'Whiteflies are small, winged insects that feed on plant sap and can cause yellowing and wilting of leaves.'
        },
        'spidermite': {
            type: 'Spider Mite',
            confidence: '90%',
            recommendation: 'Increase humidity and apply miticide. Prune affected leaves.',
            additionalInfo: 'Spider mites are tiny arachnids that create fine webs on plants and cause stippling on leaves.'
        },
        'locust': {
            type: 'Locust',
            confidence: '97%',
            recommendation: 'Immediate action required. Use approved pesticides and report to local agricultural authorities.',
            additionalInfo: 'Locusts are grasshoppers that can form swarms and cause devastating damage to crops over large areas.'
        }
    };

    // Handle click on upload area or button
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);

    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'rgba(232, 245, 233, 0.9)';
        uploadArea.style.transform = 'translateY(-2px)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.backgroundColor = 'var(--light-bg)';
        uploadArea.style.transform = 'translateY(0)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'var(--light-bg)';
        uploadArea.style.transform = 'translateY(0)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    }

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            document.querySelector('.upload-content').style.display = 'none';
            
            // Move upload section to the left and show result section
            uploadSection.classList.add('moved');
            
            // Animate confidence meter
            setTimeout(() => {
                resultSection.classList.add('visible');
                const pests = Object.keys(pestDatabase);
                const randomPest = pests[Math.floor(Math.random() * pests.length)];
                const pestInfo = pestDatabase[randomPest];
                
                // Update content with animation
                document.getElementById('pestType').textContent = pestInfo.type;
                document.getElementById('confidence').textContent = pestInfo.confidence;
                document.getElementById('recommendation').textContent = pestInfo.recommendation;
                document.getElementById('additionalInfo').textContent = pestInfo.additionalInfo;
                
                // Animate confidence meter
                const confidenceValue = parseInt(pestInfo.confidence);
                confidenceMeter.style.width = `${confidenceValue}%`;
            }, 500);
        };
        reader.readAsDataURL(file);
    }

    // Handle action buttons
    document.querySelector('.save-btn').addEventListener('click', () => {
        alert('Report saved successfully!');
    });

    document.querySelector('.share-btn').addEventListener('click', () => {
        alert('Share functionality coming soon!');
    });
}); 