document.addEventListener("DOMContentLoaded", function() {
    // Loader
    setTimeout(function() {
        document.querySelector(".loader").style.display = "none"; 
        document.querySelector(".main-content").classList.remove("hidden");
    }, 3000);
});

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('button[data-mood]');
    const dateElement = document.getElementById("date");
    const submitButton = document.getElementById("addlist");
    const monthElement = document.getElementById("month");
    const storedEmojiData = localStorage.getItem('emojiData');
    const storedNotes = localStorage.getItem('notesData');
    const emojiData = storedEmojiData ? JSON.parse(storedEmojiData) : {};
    const notesData = storedNotes ? JSON.parse(storedNotes) : {};
    const homeContent = document.getElementById('homeContent');
    const monthContent = document.getElementById('monthContent');
    const backToHome = document.getElementById('backToHome');
    const monthBtn = document.getElementById('monthBtn');

    let selectedMood = null;  
    let moodSelected = false; // Tracks if a mood has been selected

    const moodEmojis = {
        happy: '😃',
        neutral: '😐',
        sad: '😢',
        angry: '😡'
    };

    function setMoodColor(mood) {
        switch (mood) {
            case 'happy':
                dateElement.style.color = '#dda500';  // Happy color
                return '#dda500';
            case 'neutral':
                dateElement.style.color = '#00abb0';  // Neutral color
                return '#00abb0';
            case 'sad':
                dateElement.style.color = '#003380';  // Sad color
                return '#003380';
            case 'angry':
                dateElement.style.color = '#bb0000';  // Angry color
                return '#bb0000';
            default:
                dateElement.style.color = 'black';
                return 'black';
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            selectedMood = button.getAttribute('data-mood');  
            moodSelected = true; // Mark as mood selected
        });
    });

    submitButton.addEventListener('click', function() {
        const today = new Date();
        const currentMonthIndex = today.getMonth();
        const currentDay = today.getDate();
        const key = `${currentMonthIndex}-${currentDay}`;

        if (moodSelected) { // Check if a mood was selected
            const emoji = moodEmojis[selectedMood];
            const color = setMoodColor(selectedMood);  

            emojiData[key] = { emoji, color }; // Store both emoji and color
            localStorage.setItem('emojiData', JSON.stringify(emojiData));

            const note = document.getElementById("chatInput").value;
            if (note.trim()) {
                notesData[key] = note;
                localStorage.setItem('notesData', JSON.stringify(notesData));
            }
        } else {
            alert("You must select a mood first.");
        }
    });

    const months = [
        "January", "February", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December" 
    ];

    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentDay = currentDate.getDate();
    const currentKey = `${currentDate.getMonth()}-${currentDate.getDate()}`;

    monthElement.textContent = currentMonth;
    dateElement.textContent = currentDay;


    monthBtn.addEventListener('click', () => {
        homeContent.classList.add('hidden');
        monthContent.classList.remove('hidden');
        renderMonthSelection();
    });

    backToHome.addEventListener('click', () => {
        monthContent.classList.add('hidden');
        homeContent.classList.remove('hidden');
    });

    // Apply stored color for the current date or reset to black
    if (emojiData[currentKey]) {
        dateElement.style.color = emojiData[currentKey].color;
    } else {
        dateElement.style.color = 'black';
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function renderMonthSelection() {
        monthDisplay.innerHTML = '';

        const monthHeader = monthContent.querySelector('h1');
        if (monthHeader) monthHeader.style.display = 'block';

        months.forEach((month, index) => {
          const monthDiv = document.createElement('div');
          monthDiv.textContent = month;
          monthDiv.classList.add('month-item');
          monthDiv.addEventListener('click', () => displayDates(index));
          monthDisplay.appendChild(monthDiv);
        });
      }

    function displayDates(monthIndex) {
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const monthHeader = monthContent.querySelector('h1');
        if (monthHeader) monthHeader.style.display = 'none';
    
        monthDisplay.innerHTML = `<h1 style="width: 100%; text-align: center;">${months[monthIndex]}</h1>`;
    
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            const key = `${monthIndex}-${day}`;
    
            // Display stored emoji if available
            if (emojiData[key]) {
                dayDiv.textContent = `${day} ${emojiData[key].emoji}`;
            } else {
                dayDiv.textContent = day;
            }
    
            dayDiv.classList.add("date-item");
    
            const dateToCheck = new Date(year, monthIndex, day);
            const isPastDate = dateToCheck < new Date(currentDate.setHours(0, 0, 0, 0));
            const isFutureDate = dateToCheck > new Date(currentDate.setHours(0, 0, 0, 0));
    
            if (isPastDate) {
                dayDiv.classList.add("past-date");
                dayDiv.addEventListener("click", () => {
                    if (emojiData[key]) {
                        const note = notesData[key] || "No notes available for this day.";
                        alert(`Emoji: ${emojiData[key].emoji}\nNote: ${note}`);
                    } else {
                        alert("No mood or notes were recorded for this day.");
                    }
                });
            } else if (isFutureDate) {
                dayDiv.classList.add("future-date");
                dayDiv.addEventListener("click", () => {
                    alert("Future dates are not yet available.");
                });
            } else {
                dayDiv.addEventListener("click", () => {
                    monthElement.textContent = months[monthIndex];
                    dateElement.textContent = day;
                    dateElement.style.color = emojiData[key]?.color || 'black';
    
                    if (notesData[key]) {
                        alert(`Note for ${day} ${months[monthIndex]}: ${notesData[key]}`);
                    }
                });
            }
            monthDisplay.appendChild(dayDiv);
        }
    }
    

    const inputField = document.getElementById("chatInput");

    inputField.addEventListener("input", function() {
        const currentLength = inputField.value.length;

        if (currentLength > 200) {
            alert("You cannot enter more than 200 characters!");
            inputField.value = inputField.value.slice(0, 200);  
        }
    });
});
