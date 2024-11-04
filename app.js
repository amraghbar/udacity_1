const API_KEY_PIXABAY = '46897315-626794416960f2975fdc6f2e2'; // Pixabay
const API_KEY_WEATHER = '38030d45039342de948f7fd89294cee5'; // Weatherbit

const fetchImage = async (destination) => {
    const response = await fetch(`https://pixabay.com/api/?key=${API_KEY_PIXABAY}&q=${destination}&image_type=photo`);
    const data = await response.json();
    return data.hits.length > 0 ? data.hits[0].webformatURL : 'default-image.jpg';
};

const fetchWeather = async (location) => {
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?key=${API_KEY_WEATHER}&city=${location}`);
    const data = await response.json();
    return data.data ? data.data[0] : null;
};

const calculateTripLength = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const length = (end - start) / (1000 * 60 * 60 * 24);
    return length + 1; // إضافة يوم واحد
};

const saveTrips = () => {
    const trips = document.getElementById('trips').innerHTML;
    localStorage.setItem('trips', trips);
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
        document.getElementById('trips').innerHTML = savedTrips;
    }
});

document.getElementById('trip-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const hotel = document.getElementById('hotel').value;
    const flight = document.getElementById('flight').value;

    const destinations = destination.split(',').map(dest => dest.trim());
    for (const dest of destinations) {
        const imageUrl = await fetchImage(dest);
        const tripLength = calculateTripLength(startDate, endDate);
        const weatherData = await fetchWeather(dest);

        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${dest}</strong>: ${tripLength} days <br><img src="${imageUrl}" alt="${dest}" style="width:100%; height:auto;">` +
            `<br>Hotel: ${hotel}, Flight: ${flight}`;

        if (weatherData) {
            const weatherInfo = `Temperature: ${weatherData.temp}°C, Weather: ${weatherData.weather.description}`;
            listItem.innerHTML += `<br>${weatherInfo}`;
        }
        document.getElementById('trips').appendChild(listItem);
    }
    saveTrips();
});

const { jsPDF } = window.jspdf;

const printTrip = () => {
    const pdf = new jsPDF();
    pdf.text("Your Trips", 10, 10);
    const tripList = document.getElementById('trips');

    if (tripList.children.length === 0) {
        pdf.text('No trips to print.', 10, 20); // إذا كانت القائمة فارغة
    } else {
        let y = 20; // موقع النص على المحور Y
        for (let item of tripList.children) {
            pdf.text(item.textContent, 10, y);
            y += 10; // زيادة المسافة بين النصوص
        }
    }

    // حفظ ملف PDF
    pdf.save('trips.pdf');
};

document.getElementById('print-btn').addEventListener('click', printTrip);

// زر تغيير اللغة
let isArabic = true;
document.getElementById('language-toggle').addEventListener('click', function () {
    isArabic = !isArabic; // تغيير الحالة
    updateLanguage();
});

// دالة لتحديث النصوص بناءً على اللغة
function updateLanguage() {
    const title = document.getElementById('app-title');
    const destinationLabel = document.getElementById('destination-label');
    const startDateLabel = document.getElementById('start-date-label');
    const endDateLabel = document.getElementById('end-date-label');
    const hotelLabel = document.getElementById('hotel-label');
    const flightLabel = document.getElementById('flight-label');
    const tripListTitle = document.getElementById('trip-list-title');

    if (isArabic) {
        title.textContent = 'تطبيق السفر';
        document.getElementById('language-toggle').textContent = 'English';
        destinationLabel.textContent = 'الوجهات (افصل بينها بفاصلة):';
        startDateLabel.textContent = 'تاريخ البدء:';
        endDateLabel.textContent = 'تاريخ الانتهاء:';
        hotelLabel.textContent = 'اسم الفندق:';
        flightLabel.textContent = 'رقم الرحلة:';
        tripListTitle.textContent = 'الرحلات المخطط لها:';
    } else {
        title.textContent = 'Travel App';
        document.getElementById('language-toggle').textContent = 'عربي';
        destinationLabel.textContent = 'Destinations (separate with commas):';
        startDateLabel.textContent = 'Start Date:';
        endDateLabel.textContent = 'End Date:';
        hotelLabel.textContent = 'Hotel Name:';
        flightLabel.textContent = 'Flight Number:';
        tripListTitle.textContent = 'Planned Trips:';
    }
}
