import customtkinter as ct
from customtkinter import *
from tkinter import *
from PIL import ImageTk, Image
import netcheck
import threading
import time 
from ultralytics import YOLO
import cv2
import cvzone
import math
import pygame
import webbrowser 
import serial.tools.list_ports
from geopy.geocoders import Nominatim
from flight_operation import DroneController
from CTkMessagebox import CTkMessagebox  
import requests
from gtts import gTTS
import pygame
import pyttsx3


class Pop_up:
    def error(self,name, latitude  ,longitude):
        self.msg=ctkmessagebox = CTkMessagebox( title='Alert !!', message=f'Name: {name} Location: {longitude} {longitude}', fade_in_duration=100, option_1="Cancel", option_2="See in maps")
        ctkmessagebox.after(10000, ctkmessagebox.button_event)

        if self.msg.get()=='See in maps':
            ctkmessagebox.destroy()
            google_url= f"https://www.google.com/maps/search/?api=1&query={latitude},{longitude}"
            webbrowser.open(google_url)


        elif self.msg.get()=='Cancel':
            return False

class main_gui :

    def update_time(self):
        self.time = time.strftime("%H:%M:%S")
        self.date = time.strftime('%Y/%m/%d')
        set_time = f"Time:{self.time}"
        set_date = f"Date:{self.date}"
        self.show_time.configure(text=set_time, font=("", 18, "bold"))
        self.show_date.configure(text=set_date, font=("", 18, "bold"))
        self.show_time.after(1000, self.update_time)


    def __init__(self):

        self.p1 =Pop_up()
        self.root = ct.CTk() #object 
        self.root.title("Drone Software")
        self.ports = serial.tools.list_ports.comports()
        self.ports_list = []
        if not self.ports:
            print("No COM ports detected.")
        else:
            print("Detected COM ports:")
            for port in self.ports:
                print(f"Port: {port.device} " )
                self.ports_list.append(f'{port.device} {port.description}')
                
                      
        
        

#-----------------------------------------image variables--------------------------------------------
        connect_original_image = Image.open("images\\connect_button.png")
        connect_resized_image = connect_original_image.resize((40, 40), Image.ANTIALIAS)
        self.connect_button_img = ImageTk.PhotoImage(connect_resized_image)
        self.mail_status= True
        dis_original_image = Image.open("images\\disconnect_button.png")
        dis_resized_image = dis_original_image.resize((40, 40), Image.ANTIALIAS)
        self.dis_button_img = ImageTk.PhotoImage(dis_resized_image) 

        dis_cam_image = Image.open("images\\disconnected_cam.png")
        dis_resized_image = dis_cam_image.resize((40, 40), Image.ANTIALIAS)
        self.dis_cam_img = ImageTk.PhotoImage(dis_resized_image)

        conn_cam_image = Image.open("images\\connected_cam.png")
        dis_resized_image = conn_cam_image.resize((40, 40), Image.ANTIALIAS)
        self.conn_cam_img = ImageTk.PhotoImage(dis_resized_image)

        self.screen_height=self.root.winfo_screenheight()
        self.screen_width=self.root.winfo_screenwidth()

        #opening window at specific postion 

        self.root.geometry(f"{self.screen_width}x{self.screen_height}+0+0")
        
        self.top_frame = ct.CTkFrame(master = self.root, width= 1522, height=55)  #main top frame 
        self.top_frame.place(x= 8 , y=8)

        self.left_frame = ct.CTkFrame(master = self.root, width= 500, height=778)  #main left frame 
        self.left_frame.place(x= 8 , y=70)

        self.right_frame= ct.CTkFrame(master=self.root , width=1015, height=778)
        self.right_frame.place(x=515 ,y=70)

        self.show_date = ct.CTkLabel(master= self.left_frame )   #Date label 
        self.show_date.place(x=20, y= 70 )                      

        self.show_time =ct.CTkLabel(master = self.left_frame ) # Time label 
        self.show_time.place(x=350 ,y=70)

 # --------------------------------------------Buttons--------------------------------------------------------------- #

        self.connect_button = ct.CTkButton(master = self.top_frame, image= self.dis_button_img, text="", fg_color="red",hover_color="green", corner_radius=500 ,width=10 ,height=10, command=self.pixshawk_connect)  # Connect/disconnect button 
        self.connect_button.place(x=1450 , y=8) #pixshakwk button 
        

        self.com_port=ct.CTkComboBox(master=self.top_frame, values= self.ports_list, state="readonly")
        self.com_port.set("COM1")
        self.com_port.place(x=1250,y=10)

        self.arm_button = ct.CTkButton(master = self.left_frame, text="Arm",command=lambda:threading.Thread(target= self.pixshawk_arm()))  # Connect/disconnect button 
        self.arm_button.place(x=20 , y=450)

        self.auto_land_button = ct.CTkButton(master = self.left_frame, text="Auto land")  # Connect/disconnect button 
        self.auto_land_button.place(x=280 , y=450)

 # ----------------------------------------------Dashboard label--------------------------------------------------------------- #

        self.dashbaord_label= ct.CTkLabel(master=self.left_frame, text= "Dashboard" ,font=("", 20, "bold") )
        self.dashbaord_label.place( x=195 ,y=20)

 # ----------------------------------------------Altitude --------------------------------------------------------------- #

        self.altitude_label = ct.CTkLabel(master=self.left_frame , text= "Altitude(m)", font=("", 20,) ) # Altitude label 
        self.altitude_label.place(x= 20, y=120 )

        self.altitude = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.altitude.place(x= 20, y=160)

 # ----------------------------------------------Ground Speed --------------------------------------------------------------- #
        self.ground_speed_label = ct.CTkLabel(master=self.left_frame , text= "Ground Speed(m/s)", font=("", 20,) ) # Altitude label 
        self.ground_speed_label.place(x= 280, y=120 )

        self.ground_speed = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.ground_speed.place(x= 280, y=160)

 # ----------------------------------------------Distance to wp--------------------------------------------------------------- #

        self.distancewp_label = ct.CTkLabel(master=self.left_frame , text= "Dist to wp(m)", font=("", 20,) ) # Altitude label 
        self.distancewp_label.place(x= 20, y=210 )

        self.distancewp_speed = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.distancewp_speed.place(x= 20, y=250)

# ----------------------------------------------YAW--------------------------------------------------------------- #

        self.yaw_label = ct.CTkLabel(master=self.left_frame , text= "Yaw(deg)", font=("", 20,) ) # Altitude label 
        self.yaw_label.place(x= 280, y=210 )

        self.yaw = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.yaw.place(x= 280, y=250)


# ----------------------------------------------Vertical Speed--------------------------------------------------------------- #

        self.vertical_speed_label = ct.CTkLabel(master=self.left_frame , text= "Vertical speed(m/s)", font=("", 20,) ) # Altitude label 
        self.vertical_speed_label.place(x= 20, y=300)

        self.vertical_speed = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.vertical_speed.place(x= 20, y=340)


# ----------------------------------------------Distance to MAV--------------------------------------------------------------- #

        self.distancemav_label = ct.CTkLabel(master=self.left_frame , text= "Dist to MAV(m)", font=("", 20,) ) # Altitude label 
        self.distancemav_label.place(x= 280, y=300)

        self.distancemav_speed = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 25,)) # Altitude values 
        self.distancemav_speed.place(x= 280, y=340)

# ----------------------------------------------Battery percentage--------------------------------------------------------------- #

        self.battery_label = ct.CTkLabel(master=self.left_frame , text= "Battery:", font=("", 20,) ) # Altitude label 
        self.battery_label.place(x= 20, y=390)

        self.battery_value = ct.CTkLabel(master=self.left_frame , text= "---", font=("", 20,) ) # Altitude label 
        self.battery_value.place(x= 100, y=390)

        self.progressbar = ct.CTkProgressBar(master= self.left_frame ,width= 100, height=10 ,mode="determinate" )
        self.progressbar.place(x=250, y=400)
        
        self.progressbar.set(0.5)

# ----------------------------------------------Online status--------------------------------------------------------------- #
        self.net_status = ct.CTkLabel(master= self.top_frame ,text="Online", text_color="#0FFF50",font=("", 20))
        self.net_status.place(x= 20, y=12)

        try:
            from socketTest import MySocketIOClient
            self.server_url = 'https://d66f-2409-40f0-1028-fc4b-b97b-ecb6-a4c8-96c5.ngrok-free.app'
            self.my_client = MySocketIOClient(self.server_url)
            self.my_client.start()
    
            self.alert_status()
        except Exception as e:
            print(e)
        
# ----------------------------------------------Camera View-------------------------------------------------------------- #
        
        self.cap = cv2.VideoCapture(0)
        self.cap.set(3, 1280)
        self.cap.set(4, 720)
        self.model = YOLO("yolo-model\yolov8n.pt")

        self.classes = [
        "person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
        "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
        "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
        "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
        "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
        "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
        "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
        "chair", "sofa", "pottedplant", "bed", "diningtable", "toilet", "tvmonitor", "laptop",
        "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
        "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
    ]
        
#----------------------------------------Camera components--------------------------------------------

        self.cam_label = ct.CTkLabel(self.right_frame, text= "Camera view", font=('Helvetica', 14))
        self.cam_label.place(x=200, y= 80)

        self.cam_connect_button = ct.CTkButton(master = self.right_frame, image= self.dis_cam_img, text="", fg_color="red",hover_color="green", corner_radius=500 ,width=10 ,height=10, command=self.call_threaded_cam)  # Connect/disconnect button 
        self.cam_connect_button.place(x=50, y=20) #camera button 

        # self.cam_disconnect_button = ct.CTkButton(master = self.right_frame, image= self.dis_cam_img, text="", fg_color="green",hover_color="red", corner_radius=500 ,width=10 ,height=10, command=self.call_threaded_cam)  # Connect/disconnect button 
        # self.cam_disconnect_button.place(x=50, y=70) #camera button 

        self.empty_cam_frame = ct.CTkFrame(master = self.right_frame , fg_color="black", width= 800 ,height =450)
        self.empty_cam_frame.place(x=125 ,y=70)

        self.cam_status = ct.CTkLabel(master = self.empty_cam_frame , text="Camera not connected !", font=("", 18, "bold") )
        self.cam_status.place(x=300 ,y=200)

        self.yolo_detect_object=ct.CTkComboBox(master=self.right_frame, values=["All","person", "car", "bus", "dog"])
        self.yolo_detect_object.set("All")
        self.yolo_detect_object.place(x=350,y=20)

        self.start_button = ct.CTkButton(self.right_frame, text="Start Detection", command=self.start_detection)
        self.start_button.place(x=150 ,y=20)
        
        self.stop_button =ct.CTkButton(self.right_frame, text="Stop Detection", command=self.stop_detection)
        self.stop_button.place(x=550,y =20)

        self.drop_button =ct.CTkButton(self.right_frame, text="Drop", command=self.pixshawk_servo)
        self.drop_button.place(x=750,y =20)

        self.video_view = ct.CTkLabel(self.right_frame, text= "")
        self.video_view.place(x=125,y=100 )

        self.is_detection_running = False
        # self.update()
        self.update_time_thread = threading.Thread(target=self.update_time)
        self.update_time_thread.start()

        self.detected_object= []

        self.root.mainloop()

        
    def stop_camera(self):
    # You need to set a flag to stop the camera loop
        # # self.is_detection_running = False

        # # Release the camera
        pass
        # # self.cap.release()

        # # Destroy the video view widget or update it as needed
        # self.video_view.configure(image=None)

        # # You may need to recreate or reinitialize other UI elements

        # # Update the UI to show that the camera is disconnected
        # # For example, recreate the connect button
        # self.cam_disconnect_button = ct.CTkButton(master=self.right_frame, image=self.cam_disconnect_button, text="", fg_color="green", hover_color="red", corner_radius=500, width=10, height=10, command=self.call_threaded_cam)
        # self.cam_disconnect_button.place(x=150, y=20)   


    def start_detection(self):
        self.is_detection_running = True

    def stop_detection(self):
        self.is_detection_running = False

    def call_threaded_cam(self):
        # self.cam_connect_button.destroy
        # self.cam_disconnect_button = ct.CTkButton(master = self.right_frame, image= self.dis_cam_img, text="", fg_color="red",hover_color="green", corner_radius=500 ,width=10 ,height=10, command=self.stop_camera)  # Connect/disconnect button 
        # self.cam_disconnect_button.place(x=150, y=20)
        
        self.c1= threading.Thread(target=self.camera_connect())
        self.c1.start()
        # self.c1.daemon =True
        self.c1.join()
    def camera_connect(self):
            self.cam_label.destroy()
            
            self.success, self.img = self.cap.read()
            result = self.model(self.img, stream=True)
            self.empty_cam_frame.destroy()
            self.cam_status.destroy()

            if self.is_detection_running:
                for r in result:
                        boxes = r.boxes
                        for box in boxes:                                                           
                            x1, y1, x2, y2 = box.xyxy[0]
                            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

                            w, h = x2 - x1, y2 - y1


                            conf = math.ceil((box.conf[0] * 100)) / 100
                            cls = int(box.cls[0])
                            self.label = f'{conf} {self.classes[cls]}'
                            # print(label)
                            if self.yolo_detect_object.get() == "All":
                                    self.label = f'{conf} {self.classes[cls]}'
                                    cvzone.cornerRect(self.img, (x1, y1, w, h))
                                    cvzone.putTextRect(self.img, self.label, (max(0, x1), max(0, y1)))

                            elif(self.classes[cls] == self.yolo_detect_object.get()):
                                if self.classes[cls] == self.yolo_detect_object.get():
                                    self.label = f'{conf} {self.classes[cls]}'
                                    cvzone.putTextRect(self.img, self.label, (max(0, x1), max(0, y1)))
            

                    

            new_width = 900  # Adjust the width as needed
            aspect_ratio = self.img.shape[1] / self.img.shape[0]
            new_height = int(new_width / aspect_ratio)
            self.img = cv2.resize(self.img, (new_width, new_height))
            self.img = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
            self.img = Image.fromarray(self.img)
            self.img = ImageTk.PhotoImage(self.img)
            self.video_view.configure(image=self.img)
            self.video_view.image = self.img
            
                # print(class_counts)
                # if self.mail_status:
                #     self.call_mail()
            self.root.after(10, self.camera_connect)
              # Print the counts of each class


        

    
#     def net(self):
#         if netcheck.internet():
#             self.net_status.configure(text="Online", text_color="#39FF14")
#             self.net_status.after(2000, self.net)

#         elif netcheck.internet()!=True:
#             self.net_status.configure(text="Offline", text_color="red")
#             self.net_status.after(2000, self.net)


    def pixshawk_connect(self):
        try:
            self.drone_controller = DroneController()

            print("connected")
            if self.drone_controller:
                self.connect_button.destroy()
                self.disconnect_button = ct.CTkButton(master = self.top_frame, image= self.connect_button_img, text="", fg_color="green",hover_color="red", corner_radius=500 ,width=10 ,height=10, command=self.pixshawk_disconnect)  #main left frame 
                self.disconnect_button.place(x=1450 , y=8)
                self.update_drone_values = threading.Thread(target=self.pixshawk_get_info)
                self.update_drone_values.start()
            
        except Exception as e:
            print("exceptio in connection of sroneee",e)
            pass

            # self.connect_button.configure(hover_color="red", fg_color="green" , image= self.button_img)

    def pixshawk_disconnect(self):
         if self.drone_controller:
            self.drone_controller.disconnect_from_vehicle()
            print("disconnect")
            self.disconnect_button.destroy()
            self.connect_button = ct.CTkButton(master = self.top_frame, image= self.dis_button_img, text="", fg_color="red",hover_color="green", corner_radius=500 ,width=10 ,height=10, command=self.pixshawk_connect)  #main left frame 
            self.connect_button.place(x=1450 , y=8)

    def pixshawk_servo(self):
        if self.drone_controller:
            self.drone_controller.drop_package()

    def pixshawk_autoland(self):
        if self.drone_controller:
            self.drone_controller.set_mode()

    def pixshawk_arm(self):
        
        try:
            if self.drone_controller:
                self.drone_controller.arming()
        except Exception as e:
            print(e)


    def pixshawk_disarm(self):
        pass

    def pixshawk_get_info(self):
        if self.drone_controller:
            self.drone_info = self.drone_controller.print_vehicle_info()
            self.altitude.configure(text=round(self.drone_info[0], 2))
            self.ground_speed.configure(text=round(self.drone_info[1], 2))
            # Assuming self.drone_info[2] is a list of values to be rounded individually
            rounded_distancewp_speed = [round(value, 2) for value in self.drone_info[2]]
            self.distancewp_speed.configure(text=rounded_distancewp_speed)
            self.vertical_speed.configure(text=round(self.drone_info[3], 2))
            self.yaw.configure(text=round(self.drone_info[4], 2))
            self.distancemav_speed.configure(text=self.drone_info[5])
            self.battery_value.configure(text=self.drone_info[6])
            # self.signal_strength.configure(text=round(self.drone_info[7], 2))
            # self.altitude.after(1000, self.pixshawk_get_info)

        self.altitude.after(100, self.pixshawk_get_info)

    def alert_status(self):
        if self.my_client:
            print("func")
            self.data=self.my_client.return_data()
            print("func2", self.data)
            if self.data !=None:
                    print(f"{self.data}")
                    print(type(self.data))
                    self.name = self.data.get('name')
                    self.latitude = self.data.get('location').get('latitude')
                    self.longitude = self.data.get('location').get('longitude')
                    # Reverse geocoding to get human-readable location
                    geolocator = Nominatim(user_agent="location_extractor")
                    self.location = geolocator.reverse((self.latitude, self.longitude))
                    print(self.location)
                    self.play_alert()
                    self.p1.error(self.name , self.latitude, self.longitude)

                    self.my_client.reset_alert_data()
            self.altitude.after(1000, self.alert_status)
            
    def call_mail (self):


        self.mail_status= False
        self.send_emergency_mail()


    def send_emergency_mail(self):
        x = requests.get('http://10.12.4.128:4000/api/disaster/emergency_mail/5')    

        

    def play_alert(self):
        pygame.mixer.init()
        pygame.mixer.music.load('call-to-attention-123107.mp3')
        pygame.mixer.music.play()
        engine = pyttsx3.init()
        engine.setProperty('rate', 100)  
        engine.setProperty('volume',1.0) 
        engine.say(f"Emergency alert has been recevied by {self.name} at location {self.location} " )
        engine.runAndWait()
        # mt =main_gui()
m1= main_gui()


        # #combox2
        # self.lab_port=ct.CTkLabel(master=self.frame1 ,text="Port")
        # self.lab_port.place(x=20 ,y=80 )

        # self.com_port=ct.CTkComboBox(master=self.frame1, values=["COM1", "COM2","COM3", "COM4","COM5", "COM6","COM7", "COM8"], state="readonly")
        # self.com_port.set("COM1")
        # self.com_port.place(x=20 ,y=110)