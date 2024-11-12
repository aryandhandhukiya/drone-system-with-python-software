import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const NavBar=()=> {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">CodeCopter</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/emergency">Emergency</Nav.Link>
                    {/* <Nav.Link href="/disaster_details">Disaster Deatils</Nav.Link> */}
                </Nav>
            </Container>
        </Navbar>
        )
}

export default NavBar