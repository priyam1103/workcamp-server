const { v4: uuidv4 } = require('uuid');
const Camp = require("../models/camp");
const User = require("../models/user");
const {cloudinary} = require("../service/cloudinary");
exports.addCamp = async function (req, res) {
    try {
        const { campname, campdesc } = req.body;
        const current_user = req.locals;
        const current_user_id = res.locals._id;
console.log([current_user])
        const camp = new Camp({
            campname: campname,
            campdesc: campdesc,
            createdby: res.locals,
            members: [res.locals],
            campcode: uuidv4().toString().substr(0, 5)
        })
        await camp.save();
        console.log(camp)
        const user = await User.findOne({ _id: current_user_id });
        user.camps.push(camp._id);
        await user.save();

        let user_camps = [];
    
        await user.camps.map(async(item, index) => {
            let camp_ = await Camp.findOne({ _id: item });
            user_camps.push(camp_);
        })
        console.log(user_camps)
        res.status(200).json(camp._id)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Error occurred" });
    }
}

exports.joinCamp = async function (req, res) {
    try {
        const { campcode } = req.body;

        const camp = await Camp.findOne({ campcode: campcode });
        const current_user = await User.findOne({ _id: res.locals._id });
        if (camp) {
            if (camp.createdby._id == res.locals._id) {
                res.status(401).json({message:"You are the admin of this group."})
            } else if (current_user.camps.indexOf(camp._id) > -1) {
                res.status(401).json({message:"You are already in this group."})
            }
            else {
                camp.members.push(current_user);
                await camp.save();
                current_user.camps.push(camp._id);
                await current_user.save();

                res.status(200).json(camp)
            }
            
        } else {
            res.status(401).json({message:"Invalid camp code."})
        }
    } catch (err) {
        console.log(err);
    }
}

exports.mycamps = async function (req, res) {
    try {
        const user = await User.findOne({ _id: res.locals._id });
        console.log(user)
        let camps = [];
        new Promise(async(resolve,reject) => {
            await user.camps.map(async(item, index) => {
                const camp_= await Camp.findOne({ _id: item });
                camps.push(camp_);
        
                if (index == user.camps.length - 1) {
                    resolve();
             
                }
              
            })
      
        }).then(() => {
            console.log(camps)
            res.status(200).json({camps});
        })
        
        
     
    } catch (err) {
        console.log(err)
        res.status(400).json({message:"Error occured"})
    }
}

exports.getcamp = async function (req, res) {
    try {
        const { camp_id } = req.params;
        const camp = await Camp.findOne({ _id: camp_id });
        if (camp) {
            res.status(200).json(camp);

        }
    } catch (err) {
        res.status(400).json({message:"Error occured"})
    }
}

exports.addTodo = async function (req, res) {
    try {
        const { pdf_file,
            work_desc,
            camp_id,
            selectedmembers } = req.body;
        
        const camp = await Camp.findOne({ _id: camp_id });
        var file_ress = null;
        if (camp) {
            if (pdf_file) {
        
                file_res = await cloudinary.uploader.upload(pdf_file, {
                    upload_preset: "ml_default",
                });
                file_ress = file_res.public_id;
            }
            let todo_members = [];
            new Promise(async (resolve, reject) => {
                if (selectedmembers.length === 0) {
                    resolve();
                }
                await selectedmembers.map(async (item, index) => {
                    const user_ = await User.findOne({ username: item });
                    todo_members.push({ username: user_.username, imageUrl: user_.imageUrl, _id: user_._id });
                    if (index == selectedmembers.length - 1) {
                        resolve();
                    }
                })
                
                
            }).then(async() => {
                const work_data = {
                    work_date_time: new Date(),
                    work_id: uuidv4().toString().substr(0, 6) + (Math.floor(Math.random() * 90000) + 10000).toString(),
                    type: "todo",
                    fileid: file_ress,
                    workdesc: work_desc,
                    work_added_by_name: res.locals.username,
                    work_added_by_image: res.locals.imageUrl,
                    comments: [],
                    todoMembers:todo_members
                }
                await camp.camptimeline.push(work_data);
                await camp.save()
                res.status(200).json(camp)
            })
        }
    } catch (err) {
        console.log(err);
    }
    
}

exports.addWork = async function (req, res) {
    try {
        const { pdf_file, work_desc, camp_id, type } = req.body;
        const camp = await Camp.findOne({ _id: camp_id });
        var file_ress = null;
        if (camp) {
            if (pdf_file) {
        
                file_res = await cloudinary.uploader.upload(pdf_file, {
                    upload_preset: "ml_default",
                });
                file_ress = file_res.public_id;
            }

            const work_data = {
                work_date_time: new Date(),
                work_id: uuidv4().toString().substr(0, 6) + (Math.floor(Math.random() * 90000) + 10000).toString(),
                type: type,
                fileid: file_ress,
                workdesc: work_desc,
                work_added_by_name: res.locals.username,
                work_added_by_image: res.locals.imageUrl,
                comments: []
            }
            console.log(work_data)
            await camp.camptimeline.push(work_data);
            await camp.save()
            res.status(200).json(camp)
        }
    }catch (err) {
    console.log(err)
}    
}

exports.getcampWork = async function (req, res) {
    try {
        const { camp_id, work_id } = req.params;
        let campdetails = {};
        const camp = await Camp.findOne({ _id: camp_id });
        if (camp) {
            camp.camptimeline.map((item, index) => {
                if (item.work_id == work_id) {
                    campdetails = item;
                    const data ={...campdetails,campname:camp.campname,campcode:camp.campcode,members:camp.members}
                    res.status(200).json(data);
                    
                }
            })
        } else {
            res.status(400).json({ message: "error" });
        }
    } catch (err) {
        console.log(err)
        console.log(err)
    }
}

exports.addComment = async function (req, res) {
    try {
        const { camp_id, work_id } = req.params;
        const { comment } = req.body;
        var campdetails;
        var index_;
        var camp_time = [];
        const camp = await Camp.findOne({ _id: camp_id });
        if (camp) {
            new Promise(async(resolve, reject) => {
                await camp.camptimeline.map(async (item, index) => {
                    if (item.work_id == work_id) {
                        index_ = index;
                        
                        item.comments.push({
                            comment_added_by_name: res.locals.username,
                            comment_added_by_image: res.locals.imageUrl,
                            comment: comment,
                            comment_date_time: new Date()

                        })
                        campdetails = item.comments;
                        
                        resolve();
                 
                     
                    }
                })
            }).then(async () => {
                camp_time = camp.camptimeline;
                
                new Promise(async(resolve, reject) => {
                    camp.camptimeline = null;
                   // console.log( camp.camptimeline[index_].comments, "commdecfnkvf")
                    camp.camptimeline = camp_time;
                   
                    resolve()
                }).then(async() => {
                    await camp.save();
                    console.log(camp.camptimeline[index_].comments, "comments")
                    const data ={...camp.camptimeline[index_],campname:camp.campname,campcode:camp.campcode}
                    res.status(200).json(data)
                })
               
            
            })
          
           
        }
    } catch (err) {
        console.log(err);   
    }
}

exports.updateWork = async function (req, res) {
    try {
        const {  workdesc,
            campcode,
            work_id,
            file } = req.body;
        console.log(req.body);
        var campdetails = {};
        const camp = await Camp.findOne({ campcode: campcode });
        var file_ress = null;
        var dc = [];
        if (camp) {
            if (file) {
            
                var file_res = await cloudinary.uploader.upload(file, {
                    upload_preset: "ml_default",
                });
                file_ress = file_res.public_id;
            }
            camp.camptimeline.map(async(item, index) => {
console.log(index)
                if (item.work_id == work_id) {
                    console.log(workdesc);
                    
                    item.workdesc = workdesc;
                    item.fileid = file_ress;
                    new Promise((resolve, reject) => {
                        
                        camp.camptimeline[index]=null
                        camp.camptimeline[index] = item
                        dc = camp.camptimeline;
                        resolve();
                    }).then(async () => {
                        camp.camptimeline = null;
                        camp.camptimeline = dc;
                   
                        await camp.save();
                        campdetails = item;
                        const data = { ...campdetails, campname: camp.campname, campcode: camp.campcode,members:camp.members }
                        res.status(200).json(data);
                    })
                    // res.status(200).json(camp.camptimeline[index])
                }
            })
        }
        else{
            res.status(400).json({message:"error"})
        }
    } catch (err) {
        console.log(err);
    }
}

exports.updateTodo= async function (req, res) {
    try {
        const {  workdesc,
            campcode,
            selectedmembers,
            work_id,
            file } = req.body;
        console.log(req.body);
        var campdetails = {};
        const camp = await Camp.findOne({ campcode: campcode });
        var file_ress = null;
        var dc = [];
        if (camp) {
            if (file) {
            
                var file_res = await cloudinary.uploader.upload(file, {
                    upload_preset: "ml_default",
                });
                file_ress = file_res.public_id;
            }
            let todo_members = [];
            new Promise(async (resolve, reject) => {
                if (selectedmembers.length === 0) {
                    resolve();
                }
                await selectedmembers.map(async (item, index) => {
                    const user_ = await User.findOne({ username: item });
                    todo_members.push({ username: user_.username, imageUrl: user_.imageUrl, _id: user_._id });
                    if (index == selectedmembers.length - 1) {
                        resolve();
                    }
                })
                
                
            }).then(()=>{
            camp.camptimeline.map(async(item, index) => {
                if (item.work_id == work_id) {
                    console.log(workdesc);
                    
                    item.workdesc = workdesc;
                    item.todoMembers = todo_members;
                    item.fileid = file_ress;
                    new Promise((resolve, reject) => {
                        
                        camp.camptimeline[index]=null
                        camp.camptimeline[index] = item
                        dc = camp.camptimeline;
                        resolve();
                    }).then(async () => {
                        camp.camptimeline = null;
                        camp.camptimeline = dc;
                   
                        await camp.save();
                        campdetails = item;
                        const data = { ...campdetails, campname: camp.campname, campcode: camp.campcode,members:camp.members }
                        res.status(200).json(data);
                    })
                    // res.status(200).json(camp.camptimeline[index])
                }
            })
        })
        }
        else{
            res.status(400).json({message:"error"})
        }
    } catch (err) {
        console.log(err);
    }
}