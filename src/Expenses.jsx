import React, { useState, useEffect } from "react";
import { uid } from "uid";
import axios from 'axios';
import moment from "moment";
import { Card, Button, Table, Row, Col, Modal, Form } from "react-bootstrap";

const Expenses = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    jam: "",
    tanggal: "",
    nama: "",
    pengeluaraan: 0,
  });
  let month = moment();
  let monthName = month.format("DD MMMM YYYY");
  let time = moment();
  let timeFormat = time.format("hh:mm");

  useEffect(() => {
    axios.get("http://localhost:3000/items").then((res) => {
      let data = res?.data ?? [];
      let categories = {};
      let total = 0;
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        total += item.pengeluaraan;
        var e = item.tanggal;
        if (!(e in categories)) categories[e] = [];
        categories[e].push(item);
      }
      setTotal(total);
      console.log(categories);
      setExpenses(categories);
    });
  }, []);
  
  function handleChange(e) {
    let newFormState = { ...formData };
    newFormState[e.target.name] = e.target.value;
    setFormData(newFormState);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = expenses;
    let _total = [total]

    if (formData.nama === "") {
      return false;
    }
    if (formData.pengeluaraan === 0) {
      return false;
    }
    let newData = {
      id: uid(),
      jam: timeFormat,
      tanggal: monthName,
      nama: formData.nama,
      pengeluaraan: Math.floor(formData.pengeluaraan),
    };
    var tanggal = newData.tanggal;
    if (!(tanggal in data)) data[tanggal] = [];
    data[tanggal].push(newData);

    axios.post("http://localhost:3000/items", newData).then((res) => {
      console.log("Berhasil Menyimpan Data");
    });
    setExpenses(data);
    setTotal(_total);
    setShow(false);
  }
  return (
    <div>
      <div className="App mt-3">
        <h3>Diary Jajan February 2021</h3>
        <h5>Pengeluaran Bulan Ini Rp. {total.toLocaleString()}</h5>
        <Button variant="primary" className="mt-1" onClick={handleShow}>
          Tambah Item
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" name="nama" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                name="pengeluaraan"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Row xs={2} md={4} className="g-4 mt-2">
        {Object.keys(expenses).map((key) => {
          return (
            <Col>
              <Card
                style={{ width: "22rem", height: "22rem" }}
                className="shadow-sm"
              >
                <Card.Body>
                  <Table>
                    <thead>
                      <tr className="text-right">
                        <th colSpan={3} style={{textAlign: "left"}}>
                          {key.substring(0, key.length - 4)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses[key].map((expense) => {
                        return (
                          <tr>
                            <td> {expense.jam}</td>
                            <td> {expense.nama}</td>
                            <td>Rp. {expense.pengeluaraan.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      <Total expenses={expenses[key]} />
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        {/* {Array.from({ length: 4 }).map((_, idx) => (
           
          ))} */}
      </Row>
    </div>
  );
};

export default Expenses;
const Total =(props) =>{
    const expenses = props.expenses;
    const _total = expenses.reduce(
      (totalHolder, m) => totalHolder + m.pengeluaraan,
      0
    );
  
    return (
      <tr>
        <th colSpan={2} style={{ textAlign: "right" }}>
          Total
        </th>
        <th className="font-weight-bold">Rp. {_total.toLocaleString()}</th>
      </tr>
    );
                      }