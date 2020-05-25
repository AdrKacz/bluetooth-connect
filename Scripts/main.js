// Selectors

const btn_read = document.querySelector('#read');
const btn_write = document.querySelector('#write');
const list_item = document.querySelector('ul');
const send_link = document.querySelector('a');

// Helpers
let characteristic_map = {};
const service = list_item.getAttribute('service');

for (let i = 0; i < list_item.children.length; i++) {
	characteristic_map[list_item.children[i].getAttribute('characteristic')] = {
		i: i,
	};
};

// Functions

function request_bluetooth(method) {
	const map = characteristic_map[characteristic.uuid];
	let value;

	navigator.bluetooth.requestDevice({
		acceptAllDevices: true,
		optionalServices: [service],
	})
	.then(device => device.gatt.connect())
	.then(server => server.getPrimaryService(service))
	.then(service => service.getCharacteristics())
	.then(characteristics => {
		characteristics.forEach(characteristic => async function(characteristic) {
			if (method === "read") {
				value = await characteristic.readValue();
				list_item.children[map.i].children[0].children[0].value = value.getUint8(0);
			}
			else {
				const value = list_item.children[characteristic_map[characteristic.uuid].i].children[0].children[0].value;
				const checked = list_item.children[characteristic_map[characteristic.uuid].i].children[1].checked;
				if (value !== "" && checked) {
					value = await characteristic.writeValue(Uint8Array.of(value));
				};
			};
		});
	})
	.catch(error => console.log('Error:',error));
};


btn_read.addEventListener('click', function () {
	request_bluetooth('read')
});

btn_write.addEventListener('click', function () {
	request_bluetooth('write')
});

send_link.addEventListener('click', function () {
	const email = send_link.getAttribute("email");
	let href = "mailto:"+email+"?subject=Feedback&body=VALUES%0d%0a%0d%0a";
	for (let i = 0; i < list_item.children.length; i++) {
		const name = list_item.children[i].children[0].getAttribute('name');
		const value = list_item.children[i].children[0].children[0].value;
		href += name + ": " + value + "%0d%0a";
	};

	send_link.setAttribute('href', href);
});

