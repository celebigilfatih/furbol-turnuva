import { Request, Response } from 'express';
import Team from '../models/Team';

// Tüm takımları getir
export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find()
      .sort({ name: 1 });

    res.json({
      data: teams,
      total: teams.length,
      page: 1,
      limit: teams.length,
      totalPages: 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Takımlar getirilirken bir hata oluştu.' });
  }
};

// Tek takım getir
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }
    res.json({ data: team });
  } catch (error) {
    res.status(500).json({ message: 'Takım getirilirken bir hata oluştu.' });
  }
};

// Yeni takım oluştur
export const createTeam = async (req: Request, res: Response) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json({ data: team });
  } catch (error) {
    res.status(400).json({ message: 'Takım oluşturulurken bir hata oluştu.' });
  }
};

// Takım güncelle
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }
    res.json({ data: team });
  } catch (error) {
    res.status(400).json({ message: 'Takım güncellenirken bir hata oluştu.' });
  }
};

// Takım sil
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }
    res.json({ message: 'Takım başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Takım silinirken bir hata oluştu.' });
  }
};

// Oyuncu ekle
export const addPlayer = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }

    team.players.push(req.body);
    await team.save();
    res.json({ data: team });
  } catch (error) {
    res.status(400).json({ message: 'Oyuncu eklenirken bir hata oluştu.' });
  }
};

// Oyuncu güncelle
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const team = await Team.findOneAndUpdate(
      { 
        _id: req.params.id,
        'players._id': req.params.playerId 
      },
      { 
        $set: { 
          'players.$': req.body 
        } 
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Takım veya oyuncu bulunamadı.' });
    }

    res.json({ data: team });
  } catch (error) {
    res.status(400).json({ message: 'Oyuncu güncellenirken bir hata oluştu.' });
  }
};

// Oyuncu sil
export const removePlayer = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { 
        $pull: { 
          players: { _id: req.params.playerId } 
        } 
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }

    res.json({ data: team });
  } catch (error) {
    res.status(400).json({ message: 'Oyuncu silinirken bir hata oluştu.' });
  }
}; 