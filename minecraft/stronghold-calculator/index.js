let enderCoordsElement = () => document.getElementById("ender-coords")
let enderCoordTemplateElement = () => document.getElementById("ender-coord-template")

function addEnderCoordElement() {
    enderCoordsElement().appendChild(enderCoordTemplateElement().content.cloneNode(true))
}

class EnderCoord {
    constructor(x, z, yaw) {
        this.x = x
        this.z = z
        this.yaw = yaw
    }
}

class Coord {
    constructor(x, z) {
        this.x = x
        this.z = z
    }
}

function getEnderCoords() {
    let enderCoords = []
    for (let element of enderCoordsElement().getElementsByClassName("ender-coord")) {
        enderCoords.push(element)
    }

    return enderCoords
        .map(element => {
            let x = element.getElementsByClassName("ender-coord-x")[0].value
            let z = element.getElementsByClassName("ender-coord-z")[0].value
            let yaw = element.getElementsByClassName("ender-coord-yaw")[0].value

            if (x === "" || z === "" || yaw === "") {
                return null
            }

            x = Number(x)
            z = Number(z)
            yaw = Number(yaw)

            if (isNaN(x) || isNaN(z) || isNaN(yaw)) {
                return null
            }

            return new EnderCoord(x, z, yaw / 180 * Math.PI)
        })
        .filter(enderCoord => enderCoord != null)
}

function calculateStrongholdCoords(coord0, coord1) {
    let x0 = coord0.x
    let z0 = coord0.z
    let yaw0 = coord0.yaw
    let x1 = coord1.x
    let z1 = coord1.z
    let yaw1 = coord1.yaw

    let x = (x1 / Math.tan(yaw1) - x0 / Math.tan(yaw0) + z1 - z0) / (1 / Math.tan(yaw1) - 1 / Math.tan(yaw0))
    let z = z0 - (x - x0) / Math.tan(yaw0)

    return new Coord(x, z)
}

function calculate() {
    let enderCoords = getEnderCoords()
    let x = ""
    let z = ""

    if (enderCoords.length >= 2 && enderCoords[0] !== enderCoords[1]) {
        let coords = calculateStrongholdCoords(enderCoords[0], enderCoords[1])

        if (!isNaN(coords.x) && !isNaN(coords.z)) {
            x = Math.round(coords.x)
            z = Math.round(coords.z)
        }
    }

    document.getElementById("stronghold-coord-x").value = x
    document.getElementById("stronghold-coord-z").value = z
}
