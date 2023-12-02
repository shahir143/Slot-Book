const slotsList = document.getElementById('slots-List');
const schedule = document.getElementById('meet-Schedule');
const slotForm = document.getElementById('slot-form');
const myForm = document.getElementById('my-form');
const userName = document.getElementById('name');
const userEmail = document.getElementById('email');
const drp = document.getElementById('dropdown-container');

let selectedSlot=null;

function createHTMLElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}


document.addEventListener('DOMContentLoaded', async()=>{
    try {
        const totalSlots = await axios.get('http://localhost:4000/user/meet');
        console.log(totalSlots)
        totalSlots.data.forEach((slot) => {
            displaySlot(slot);
        });
    } catch (err) {
        console.error('Error loading data:', err);
    }
});

async function displaySlot(slot) {
    console.log(slot);

    if(slot.slotsAvail>0){
    const outerDiv = createHTMLElement('div', 'meeting-Times');
    outerDiv.id = slot.id;
    const div = createHTMLElement('div', 'cards');
    const timing = createHTMLElement('h1', 'time', slot.time);
    const available = createHTMLElement('h3', 'available', `${slot.slotsAvail} Available`);
    
    div.appendChild(timing);
    div.appendChild(available);
    outerDiv.appendChild(div);

    outerDiv.addEventListener('click', () => {
        drp.style.display = 'block';
        let currentslot = outerDiv.id;
        if (currentslot === selectedSlot) { //it will open when we clicked another time
            drp.style.display = drp.style.display === 'none' ? 'block' : 'none';
        }
        selectedSlot = selectedSlot === currentslot ? selectedSlot : currentslot;
    });
    
    slotsList.appendChild(outerDiv);
}
    loadSlots(slot)
}

myForm.addEventListener('submit', scheduleMeeting);

async function scheduleMeeting(e) {
    e.preventDefault();
    const time = document.getElementById(selectedSlot).firstChild.firstChild.textContent;
    const slot = {
        meetId: selectedSlot,
        name: userName.value,
        email: userEmail.value,
        time: time,
    };

    try {
        const slotDetails = await axios.post('http://localhost:4000/user/book-slot', slot);
        displaymeet(slotDetails.data);
        myForm.reset();
        drp.style.display = 'none';
    } catch (error) {
        console.error('Error scheduling meeting:', error);
    }
}

async function loadSlots(data) {
    try {
        const SlotData = await axios.get(`http://localhost:4000/user/slots/${data.id}`);
        SlotData.data.forEach((val) => {
            console.log(val);
            displaymeet(val);
        });
    } catch (err) {
        console.error('Error loading slots:', err);
    }
}
async function displaymeet(val){
        const newSlot = createHTMLElement("div", "card-body");
        const nameSlot = createHTMLElement('h1', 'card-title', `Hi ${val.name},`);
        const slotLink = createHTMLElement('p', 'card-text', `Please join the meeting at ${val.time}`);
        const link = createHTMLElement("a", "btn btn-primary");
        link.href = "https://meet.google.com/pmi-bqjw-ukw";
        link.appendChild(document.createTextNode('Join'));

        const deleteBtn = createHTMLElement('button', 'btn btn-danger', 'Cancel');

        newSlot.appendChild(nameSlot);
        newSlot.appendChild(slotLink);
        newSlot.appendChild(link);
        newSlot.appendChild(deleteBtn);

        schedule.appendChild(newSlot);
        
        const deleteHandler = async (e) => {
            e.preventDefault();
            const target = e.target.parentNode;
            console.log(val.id);
            try {
                console.log(target);
                await axios.delete(`http://localhost:4000/user/cancel-slot/${val.id}`);
                target.parentNode.removeChild(target);
                deleteBtn.removeEventListener('click', deleteHandler);
            } catch (e) {
                console.log('Error deleting');
            }
        };

        deleteBtn.addEventListener('click', deleteHandler);

}


